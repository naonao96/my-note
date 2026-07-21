from flask import Blueprint, render_template, url_for, session
import app.common.consts as consts

splash_bp = Blueprint("splash", __name__, url_prefix="/splash")

@splash_bp.route("/")
def splash_window():
    is_logged_in : bool = session.get("user_id") is not None
    return render_template(
        consts.SPLASH_HTML_NAME,
        timer= 4000,
        nextUrl=url_for("notes.startup"),
        isLoggedIn=is_logged_in
        )