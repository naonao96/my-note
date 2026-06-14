from functools import wraps
from flask import session, redirect, url_for

def login_required(func):
    @wraps(func)
    def wrapper(*args, **keywargs):
        if session.get("user_id") is None:
            return redirect(url_for("auth.google_login"))
        return func(*args, **keywargs)
    return wrapper