from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config["SECRET_KEY"] = Config.FLASK_SECRET_KEY
    
    db.init_app(app)

    return app