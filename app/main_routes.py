from flask import request, jsonify, render_template, Blueprint, redirect, url_for

main_bp = Blueprint('main', __name__)

@main_bp.route("/")
def root():
    return redirect(url_for("notes.index"))