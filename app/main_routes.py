from flask import Blueprint, redirect, url_for, send_from_directory, current_app, render_template

main_bp = Blueprint('main', __name__)

@main_bp.route("/")
def root():
    return redirect(url_for("splash.splash_window"))

@main_bp.route("/privacy")
def privacy():
    return render_template("pages/privacy.html")

@main_bp.route("/sw.js")
def service_worker():
    return send_from_directory(
        current_app.static_folder,
        "sw.js",
        mimetype="application/javascript"
    )