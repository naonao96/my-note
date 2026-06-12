from app import db
from app.models.user_model import User

class UsersRepository:
    def __init__(self):
        self.db = db

    def user_read(self, google_id : str):
        # getは主キー検索専用のためfilter_byを使用
        return User.query.filter_by(google_id=google_id).first()
    
    def create(self, user_data : User):
        try:
            self.db.session.add(user_data)
            self.db.session.commit()
            return True
        except Exception as e:
            print(e)
            self.db.session.rollback()
            return False