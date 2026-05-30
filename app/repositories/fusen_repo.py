from app import db
from app.models.fusen_model import Fusen

class FusenRepository:

    def __init__(self):
        self.db = db

    '''create note data'''
    def create(self, note_data):
        try:
            self.db.session.add(note_data)
            self.db.session.commit()
            return True
        except Exception as e:
            print(e)
            self.db.session.rollback()
            return False

    '''read note data'''
    def read_all_notes(self):
        return Fusen.query.all()

    def read_note(self, note_id):
        return Fusen.query.get(note_id)

    '''update note data'''
    def update(self, note_data):
        pass

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