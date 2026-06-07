from flask import render_template, Blueprint, redirect, session, request, url_for
from config import Config
from urllib.parse import urlencode
import secrets
import requests

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/login")
def login_home():
    return render_template("login.html")

@auth_bp.route("/google/login", methods=["GET"])
def google_login():
    state:str = secrets.token_urlsafe(32)
    session["oauth_state"] = state

    params :dict = {
        "client_id" : Config.CLIENT_ID,  # アプリID
        "redirect_uri" : Config.REDIRECT_URI, # アプリシークレット
        "response_type" : "code", # アクセストークン引換券
        "scope" : "openid email profile", # 取得情報の指定
        "state" : state # callback redirect url
    }

    google_url : str = "https://accounts.google.com/o/oauth2/v2/auth?" + urlencode(params)

    return redirect(google_url)

@auth_bp.route("/google/login/callback")
def login_callback():
    if request.args.get("state") != session.get("oauth_state"):
        print("不正なアクセスが発生しました。")
        return redirect(url_for("auth.login_home"))
    
    # Code取得（アクセストークン引換券）
    code:str = request.args.get("code")

    params:dict = {
        "client_id":Config.CLIENT_ID, # アプリID
        "client_secret":Config.CLIENT_SECRET, # アプリシークレット
        "code":code, # アクセストークン引換券
        "grant_type":"authorization_code", # oauth通信形式
        "redirect_uri":Config.REDIRECT_URI # callback redirect url
    }

    # Googleへアクセストークンのリクエスト
    google_url : str = "https://oauth2.googleapis.com/token"
    response:requests.Response = requests.post(google_url, data=params)
    
    if response.status_code != 200:
        print("ログインに失敗しました。")
        return redirect(url_for("auth.login_home"))
    
    token_data:dict = response.json()
    print(token_data)
    access_token:dict = token_data.get("access_token")
    
    if not access_token:
        print("アクセストークンの取得に失敗しました。")
        return 
    
    user_info_response = requests.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={
            "Authorization":f"Bearer {access_token}"
        }
    )
    if user_info_response.status_code != 200:
        print("Googleユーザー情報の取得に失敗しました。")
        return redirect(url_for("auth.login_home"))
    
    google_user:dict = user_info_response.json()
    print(google_user)
    
    return redirect(url_for("notes.index"))