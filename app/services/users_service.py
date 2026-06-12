"""
このファイルはサービス層です。
Routesから呼び出され、アプリケーションのビジネスロジックを担当します。
Repositoryを利用してデータの取得・更新を行い、
ModelとDTOの変換も担当します。
"""
from app.repositories.users_repo import UsersRepository
from app.models.user_model import User
from app.dto.user_data import UserData
import app.common.messages as msg
import app.common.util as util

class UserService:
    def __init__(self):
        self.user_repo : UsersRepository = UsersRepository()
    
    def user_read(self, google_id: str) -> UserData | None:
        model: User = self.user_repo.user_read(google_id)
        if model is None:
            return None
        
        return UserData.from_model(model)
    
    def user_create(self, user_data : UserData) -> dict:
        dto:UserData = UserData()
        success : bool = self.user_repo.create(dto.to_model(user_data))
        if not success:
            return util.res_msg_pack(success, msg.USER_DATA_CREATE_ERROR)

        return util.res_msg_pack(success, "")

