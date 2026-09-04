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

# ----- Page Routes -----
@auth_bp.route("/google/login", methods=["GET"])
def google_login():
    """
    Google OAuth認証を開始する。

    認証用stateを生成してセッションに保存し、
    Googleの認証画面へリダイレクトする。
    """
    state: str = secrets.token_urlsafe(32)
    session["oauth_state"] = state
    google_url: str = consts.GOOGLE_LOGIN_WINDOW_URL + urlencode(google_first_req_param(state))

    return redirect(google_url)

@auth_bp.route("/google/login/callback")
def login_callback():
    """
    Google OAuth認証後のコールバックを処理する。

    認証コードからアクセストークンを取得し、
    Googleユーザー情報をもとにログイン処理を行う。
    """
    response: requests.Response
    service: UserService = UserService()
    try:
        user_valid.unauthorized_check(request.args.get("state"), session.get("oauth_state"))
        
        code: str | None = request.args.get("code")
        user_valid.get_access_token_code_check(code)

        response = requests.post(consts.ACCESS_TOKEN_REQ_URL, data=callback_param(code), timeout=10)
        user_valid.login_check(response)
        
        access_token: str | None = response.json().get("access_token")
        user_valid.access_token_check(access_token)
        
        response = requests.get(consts.USER_INFO_RES_URL, headers={"Authorization":f"Bearer {access_token}"}, timeout=10)
        user_valid.google_user_read_check(response)

        user_data: UserData = get_or_create_user(service, response.json())
        user_valid.user_data_exist_check(user_data)

        session["user_id"] = user_data.id
        session.permanent = True
        
    except Exception as e:
        logging.exception(e)
        return redirect(url_for("notes.startup"))
    finally:
        session_clean("oauth_state")
    
    return redirect(url_for("notes.startup"))

@auth_bp.route("/google/logout", methods=["POST"])
def logout():
    session_clean("user_id")
    return redirect(url_for("notes.startup"))

@auth_bp.route("/google/account/delete", methods=["POST"])
def delete_account():
    service: UserService = UserService()
    user_id: int | None = session.get("user_id")
    if user_id is None:
        return redirect(url_for("notes.startup"))
    try:
        service.user_delete(user_id)
        session_clean("user_id")
    except Exception as e:
        logging.exception(e)
        
    return redirect(url_for("notes.startup"))

# ----- Helper Functions -----
def google_first_req_param(state: str) -> dict:
    """
    Google OAuth認証リクエスト用のパラメータを生成する。
    """
    return {
        "client_id": Config.CLIENT_ID,
        "redirect_uri": Config.REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "state": state
    }

def callback_param(code: str) -> dict:
    """
    アクセストークン取得リクエスト用のパラメータを生成する。
    """
    return {
        "client_id": Config.CLIENT_ID,
        "client_secret": Config.CLIENT_SECRET, 
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": Config.REDIRECT_URI
    }

def set_user_data(google_user: dict) -> UserData:
    """
    Googleユーザー情報からUserDataを生成する。
    """
    return UserData(
        google_id=google_user.get("id"),
        email=google_user.get("email"),
        name=google_user.get("name"),
        picture=google_user.get("picture"),
    )

def get_or_create_user(service: UserService, google_user: dict) -> UserData | None:
    '''
    ユーザの存在チェック（存在しない場合はユーザー登録）
    '''
    user_data: UserData | None = service.user_read_by_google_id(google_user.get("id"))
    if user_data is None:
        create_user: UserData = set_user_data(google_user)
        service.user_create(create_user)
        user_data = service.user_read_by_google_id(google_user.get("id"))
    return user_data

def session_clean(session_name: str) -> None:
    """
    指定したキーをセッションから削除する。
    """
    session.pop(session_name, None)