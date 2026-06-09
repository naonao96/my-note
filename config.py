'''application configuration'''
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CLIENT_ID = os.getenv('CLIENT_ID')
    REDIRECT_URI = os.getenv('REDIRECT_URI')
    CLIENT_SECRET = os.getenv('CLIENT_SECRET')
    FLASK_SECRET_KEY= os.getenv('FLASK_SECRET_KEY')
    SESSION_COOKIE_SECURE = os.getenv('SESSION_COOKIE_SECURE')