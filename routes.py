from flask import request, jsonify
from app import db
from models import Note

def register_routes(app):
    
    @app.route("/")
    def index():
        return "<h1>毎日ノート</h1>"

    @app.route("/notes", methods=["POST"])
    def create_note():
        data = request.get_json()
        
        note = Note(
            title = data.get("title"),
            context = data.get("context")
        )

        db.session.add(note)
        db.session.commit()

        return jsonify({"message": "Note created successfully", "note_id": note.id}), 201
    
    @app.route("/notes", methods=["GET"])
    def get_notes():
        note = Note.query.all()

        return jsonify([{
            "id": note.id,
            "title": note.title,
            "context": note.context
        }
            for note in note
        ])