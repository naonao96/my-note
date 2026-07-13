from flask import Blueprint, render_template, url_for, session

splash_bp = Blueprint("splash", __name__, url_prefix="/splash")

@splash_bp.route("/")
def splash_window():
    is_logged_in : bool = session.get("user_id") is not None
    return render_template(
        "splash.html",
        timer= 4000,
        nextUrl=url_for("notes.startup"),
        isLoggedIn=is_logged_in
        )