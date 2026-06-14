from app import db
from app.models.fusen_model import Fusen
import app.validators.fusen_validator as fusen_valid

class FusenRepository:

    def __init__(self):
        self.db = db

    '''付箋情報作成'''
    def create(self, fusen_data : Fusen):
        try:
            self.db.session.add(fusen_data)
            self.db.session.commit()
        except:
            self.db.session.rollback()
            raise

    '''付箋情報全件検索'''
    def read_all_fusen(self, user_id : int):
        try:
            return Fusen.query.filter_by(user_id=user_id).order_by(Fusen.created_at.desc()).all()
        except:
            raise
    
    '''付箋情報検索（指定）'''
    def read_fusen(self, fusen_id: int, user_id : int):
        try:
            fusen_data : Fusen = Fusen.query.filter_by(id=fusen_id, user_id=user_id).first()
            fusen_valid.fusen_data_exist_check(fusen_data)
            return fusen_data
        except:
            raise

    '''付箋情報更新'''
    def update(self, req_fusen_data : Fusen) -> Fusen:
        try:
            # Updateを行うデータが存在することを確認
            res_fusen_data = self.read_fusen(req_fusen_data.id, req_fusen_data.user_id)
            
            res_fusen_data.content = req_fusen_data.content
            res_fusen_data.expires_at = req_fusen_data.expires_at
            res_fusen_data.color = req_fusen_data.color
            self.db.session.commit()

            return res_fusen_data
        except:
            self.db.session.rollback()
            raise

    '''付箋情報削除'''
    def delete(self, fusen_id : int, user_id : int):
        try:
            fusen_data = Fusen.query.filter_by(id=fusen_id, user_id=user_id).first()
            fusen_valid.fusen_data_exist_check(fusen_data)
            self.db.session.delete(fusen_data)
            self.db.session.commit()
        except:
            self.db.session.rollback()
            raise