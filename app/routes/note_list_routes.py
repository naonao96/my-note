from flask import request, jsonify, render_template, Blueprint
from app.dto.fusen_data import FusenData
from app.services.notes_service import NoteService as note_ctl

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
    
    note = FusenData(
        content = data.get("content"),
        expires_at= data.get("expires_at"),
        color= data.get("color")
    )
    note_ctl.create_note(note)

@note_bp.route("/notes", methods=["GET"])
def get_notes():
    notes = note_ctl.read_all_notes()

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
