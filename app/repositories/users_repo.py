from app import db
from app.models.user_model import User

class UsersRepository:
    def __init__(self):
        self.db = db

    def read(self, google_id : str):
        # getは主キー検索専用のためfilter_byを使用
        return User.query.filter_by(google_id=google_id).first()
    
    def create(self, user_data : User) -> None:
        try:
            self.db.session.add(user_data)
            self.db.session.commit()
        except:
            self.db.session.rollback()
            raise

    def delete(self, user_id : int) -> None:
        try:
            user : User | None = self.db.session.get(User, user_id)
            if user is None:
                return
            self.db.session.delete(user)
            self.db.session.commit()
        except:
            self.db.session.rollback()
            raise