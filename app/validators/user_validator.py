from app.dto.user_data import UserData
import requests
import app.common.messages as msg

def unauthorized_check(state:str | None, oauth_state:str | None) -> bool:
    if state != oauth_state:
        print(msg.UNAUTHORIZED_ACCESS_ERROR)
        return False
    return True

def get_access_token_code_check(code) -> bool:
    if not code:
        print(msg.GET_ACCESS_TOKEN_CODE_EXIST_ERROR)
        return False
    return True

def login_check(response:requests.Response) -> bool:
    if response.status_code != 200:
            print(msg.LOGIN_ERROR)
            return False
    return True

def access_token_check(access_token:str) -> bool:
    if not access_token:
        print(msg.ACCESS_TOKEN_READ_ERROR)
        return False
    return True

def google_user_read_check(response:requests.Response) -> bool:
    if response.status_code != 200:
        print(msg.GOOGLE_USER_DATA_READ_ERROR)
        return False
    return True

def user_data_exist_check(user_data:UserData) -> bool:
    if user_data is None:
        print(msg.GOOGLE_USER_DATA_READ_ERROR)
        return False
    return True
