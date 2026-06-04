from flask import Blueprint, redirect, url_for
from config import Config

main_bp = Blueprint('main', __name__)

@main_bp.route("/")
def root():
    debug_flg : str = Config.DEBUG_FLG
    if debug_flg == "LOGIN_TEST_MODE":
        return redirect(url_for("auth.login_home"))
    else:
        return redirect(url_for("notes.index"))