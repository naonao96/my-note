"""
このファイルはサービス層です。
Routesから呼び出され、アプリケーションのビジネスロジックを担当します。
Repositoryを利用してデータの取得・更新を行い、
ModelとDTOの変換も担当します。
"""
from app.repositories.users_repo import UsersRepository
from app.models.user_model import User
from app.dto.user_data import UserData

class UserService:
    def __init__(self):
        self.user_repo: UsersRepository = UsersRepository()
    
    def user_read_by_google_id(self, google_id: str) -> UserData | None:
        '''
        ユーザ情報を取得する(GoogleID)
        Args:
            google_id（str）:GoogleユーザID
        '''
        model: User | None = self.user_repo.read_by_google_id(google_id)
        if model is None: 
            return None
        return UserData.from_model(model)

    def user_read_by_user_id(self, user_id: int) -> UserData | None:
        '''
        ユーザ情報を取得する(UserID)
        Args:
            user_id (int) :ユーザID
        '''
        model: User | None = self.user_repo.read_by_user_id(user_id)
        if model is None:
            return None
        return UserData.from_model(model)
    
    def user_create(self, user_data : UserData) -> None:
        '''
        ユーザ情報を作成する
        Args:
            user_data（UserData）:ユーザ情報
        '''
        self.user_repo.create(user_data.to_model(user_data))

    def user_delete(self, user_id : int) -> None:
        '''
        ユーザ情報を削除する
        Args:
            user_id（int）:ユーザID
        '''
        # ユーザ情報を削除
        self.user_repo.delete(user_id)
