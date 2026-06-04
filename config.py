'''application configuration'''
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CLIENT_ID = os.getenv('CLIENT_ID')

    #debug用
    DEBUG_FLG = os.getenv('DEBUG_FLG')