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
        "client_id" : Config.CLIENT_ID,
        "redirect_uri" : Config.REDIRECT_URI,
        "response_type" : "code",
        "scope" : "openid email profile",
        "state" : state
    }

    google_url : str = "https://accounts.google.com/o/oauth2/v2/auth?" + urlencode(params)

    return redirect(google_url)

@auth_bp.route("/google/login/callback")
def login_callback():
    print("設定したstate:"+ request.args.get("state"))
    print("callbackされたstate" + session.get("oauth_state"))
    if request.args.get("state") != session.get("oauth_state"):
        return "不正なアクセスが発生しました。"
    
    code:str = request.args.get("code")

    params:dict = {
        "client_id":Config.CLIENT_ID,
        "client_secret":Config.CLIENT_SECRET,
        "code":code,
        "grant_type":"authorization_code",
        "redirect_uri":Config.REDIRECT_URI
    }

    google_url : str = "https://oauth2.googleapis.com/token"
    response:requests.Response = requests.post(google_url, data=params)
    token_data:dict = response.json()
    print(token_data)

    if response.status_code != 200:
        print("ログインに失敗しました。")
        return redirect(url_for("auth.login_home"))
    
    return redirect(url_for("notes.index"))