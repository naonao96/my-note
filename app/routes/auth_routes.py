from flask import request, jsonify, render_template, Blueprint, redirect, url_for
from config import Config
import secrets
from urllib.parse import urlencode 

auth_bp = Blueprint("auth", __name__, url_prefix="/login")

@auth_bp.route("/")
def login_home():
    return render_template("login.html")

@auth_bp.route("/auth/google/login", methods=["GET"])
def google_login():
    params :dict = {
        "client_id" : Config.CLIENT_ID,
        "redirect_uri" : "",
        "response_type" : "code",
        "scope" : "openid email profile",
        "ramdom_id" : secrets.token_urlsafe(32)
    }

    google_url : str = "https://accounts.google.com/o/oauth2/v2/auth?" + urlencode(params)

    return redirect(google_url)

