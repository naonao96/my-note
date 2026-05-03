from flask import request, jsonify, render_template, Blueprint
from app.models.models import Notes
import app.repositories.note_repository as note_repo

'''
Memo:notesは名前空間のようなもの
BlueprintはFlaskの機能で、アプリケーションのルーティングやビュー関数をグループ化するためのもの
url_prefixはこのBlueprintに属するすべてのルートのURLの前に付加されるプレフィックスを指定するためのもの
例えば、url_prefix='/note_list'と指定すると、このBlueprintに属するすべてのルートは
/note_listから始まるURLになります
'''
note_bp = Blueprint('notes', __name__, url_prefix='/note_list')

@note_bp.route("/")
def index():
    return render_template("notes_list.html")

@note_bp.route("/notes", methods=["POST"])
def create_note():
    data = request.get_json()
    
    note = Notes(
        context = data.get("context")
    )
    note_repo.create(note)
    return jsonify({"message": "Note created successfully", "note_id": note.id}), 201

@note_bp.route("/notes", methods=["GET"])
def get_notes():
    notes = note_repo.read_all_notes()

    return jsonify([{
        "id": note.id,
        "context": note.context,
        "created_at": note.created_at.isoformat(),  
        "updated_at": note.updated_at.isoformat()
    }
        for note in notes
    ])

@note_bp.route("/new_note", methods=["GET"])
def new_note():
    return render_template("new_note.html")
