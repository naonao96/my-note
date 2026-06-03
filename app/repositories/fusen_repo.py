from app import db
from app.models.fusen_model import Fusen

class FusenRepository:

    def __init__(self):
        self.db = db

    '''create note data'''
    def create(self, fusen_data : Fusen):
        try:
            self.db.session.add(fusen_data)
            self.db.session.commit()
            return True
        except Exception as e:
            print(e)
            self.db.session.rollback()
            return False

    '''read note data'''
    def read_all_notes(self):
        return Fusen.query.order_by(Fusen.created_at.desc()).all()

    def read_note(self, fusen_id: int):
        return Fusen.query.get(fusen_id)

    '''update note data'''
    def update(self, fusen_data : Fusen):
        fusen = Fusen.query.get(fusen_data.id)
        if fusen is None:
            return False
        try:
            fusen.content = fusen_data.content
            fusen.expires_at = fusen_data.expires_at
            fusen.color = fusen_data.color
            db.session.commit()
            return True
        except Exception as e:
            print(e)
            db.session.rollback()
            return False

    '''delete note data'''
    def delete(self, note_id):
        note = Fusen.query.get(note_id)
        if note is None:
            return False

        try:
            self.db.session.delete(note)
            self.db.session.commit()
            return True
        except Exception as e:
            print(e)
            self.db.session.rollback()
            return False