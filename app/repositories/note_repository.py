from app import db
from app.dto.fusen_data import FusenData

class NoteRepository:

    def __init__(self):
        self.db = db

    '''create note data'''
    def create(self, note_data):
        self.db.session.add(note_data)
        self.db.session.commit()

    '''read note data'''
    def read_all_notes(self):
        return FusenData.query.all()

    def read_note(self, note_id):
        return FusenData.query.get(note_id)

    '''update note data'''
    def update(self, note_data):
        existing_note = FusenData.query.get(note_data.id)
        if existing_note:
            existing_note.title = note_data.title
            existing_note.context = note_data.context
            self.db.session.commit()
            return True
        return False

    '''delete note data'''
    def delete(self, note_id):
        note = FusenData.query.get(note_id)
        if note:
            self.db.session.delete(note)
            self.db.session.commit()
            return True
        return False