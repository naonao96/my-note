from app.dto.user_data import UserData
import requests
import app.common.messages as msg

def unauthorized_check(state:str | None, oauth_state:str | None) -> bool:
    if state != oauth_state:
        raise Exception(msg.UNAUTHORIZED_ACCESS_ERROR)

def get_access_token_code_check(code) -> bool:
    if not code:
        raise Exception(msg.GET_ACCESS_TOKEN_CODE_EXIST_ERROR)

def login_check(response:requests.Response) -> bool:
    if response.status_code != 200:
        raise Exception(msg.LOGIN_ERROR)

def access_token_check(access_token:str) -> bool:
    if not access_token:
        raise Exception(msg.ACCESS_TOKEN_READ_ERROR)

def google_user_read_check(response:requests.Response) -> bool:
    if response.status_code != 200:
        raise Exception(msg.GOOGLE_USER_DATA_READ_ERROR)

def user_data_exist_check(user_data:UserData) -> bool:
    if user_data is None:
        raise Exception(msg.GOOGLE_USER_DATA_READ_ERROR)
