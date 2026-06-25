from flask import Blueprint, redirect, session, request, url_for
from config import Config
from urllib.parse import urlencode
from app.services.users_service import UserService
from app.dto.user_data import UserData
import secrets
import requests
import app.validators.user_validator as user_valid
import app.common.consts as consts
import logging

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/google/login", methods=["GET"])
def google_login():
    state:str = secrets.token_urlsafe(32)
    session["oauth_state"] = state
    google_url : str = consts.GOOGLE_LOGIN_WINDOW_URL + urlencode(google_first_req_param(state))

    return redirect(google_url)

@auth_bp.route("/google/login/callback")
def login_callback():
    response:requests.Response
    service : UserService = UserService()
    try:
        user_valid.unauthorized_check(request.args.get("state"), session.get("oauth_state"))
        
        code: str | None = request.args.get("code")
        user_valid.get_access_token_code_check(code)

        response = requests.post(consts.ACCESS_TOKEN_REQ_URL, data=callback_param(code), timeout=10)
        user_valid.login_check(response)
        
        access_token:str | None = response.json().get("access_token")
        user_valid.access_token_check(access_token)
        
        response = requests.get(consts.USER_INFO_RES_URL, headers={"Authorization":f"Bearer {access_token}"}, timeout=10)
        user_valid.google_user_read_check(response)

        user_data : UserData = user_check(service, response.json())
        user_valid.user_data_exist_check(user_data)

        session["user_id"] = user_data.id
        
    except Exception as e:
        logging.exception(e)
        return redirect(url_for("auth.login_home"))
    finally:
        session_clean("oauth_state")
    
    return redirect(url_for("notes.index"))

'''Param・dto設定関数'''
def google_first_req_param(state:str) -> dict:
    return {
        "client_id" : Config.CLIENT_ID,  # アプリID
        "redirect_uri" : Config.REDIRECT_URI, # コールバック関数URL
        "response_type" : "code", # アクセストークン引換券
        "scope" : "openid email profile", # 取得情報の指定
        "state" : state # callback redirect url
    }

def callback_param(code : str) -> dict:
    return {
        "client_id":Config.CLIENT_ID, # アプリID
        "client_secret":Config.CLIENT_SECRET, # アプリシークレット
        "code": code, # アクセストークン引換券
        "grant_type":"authorization_code", # oauth通信形式
        "redirect_uri":Config.REDIRECT_URI # callback redirect url
    }

def set_user_data(google_user:dict) -> UserData:
    return UserData(
        google_id=google_user.get("id"),
        email=google_user.get("email"),
        name=google_user.get("name"),
        picture=google_user.get("picture"),
    )

'''ユーザの存在チェック（存在しない場合はユーザー登録）'''
def user_check(service : UserService, google_user : dict):
        user_data : UserData | None = service.user_read(google_user.get("id"))
        if user_data is None:
            create_user:UserData = set_user_data(google_user)
            service.user_create(create_user)
            user_data = service.user_read(google_user.get("id"))
        return user_data

'''後始末（セキュリティのため不要なセッションは削除）'''
def session_clean(session_name : str):
      session.pop(session_name, None)