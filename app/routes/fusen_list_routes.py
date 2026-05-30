from flask import request, jsonify, render_template, Blueprint, redirect, url_for
from app.dto.fusen_data import FusenData
from app.services.fusen_service import FusenService
import app.common.messages as msg

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
    note_ctl = FusenService()

    return render_template(
        "notes_list.html",
        fusenList = note_ctl.fusen_all_read()
    )

@note_bp.route("/notes", methods=["POST"])
def fusen_create():
    note = FusenData(
        content = request.form.get("content"),
        expires_at= request.form.get("expires_at"),
        color= request.form.get("color")
    )
    
    note_ctl = FusenService()
    res_create = note_ctl.fusen_create(note)
    if not res_create["success"]:
        print(msg.FUSEN_DATA_CREATE_ERROR)

    return redirect(url_for("notes.index"))
    
@note_bp.route("/new_note", methods=["GET"])
def new_fusen():
    return render_template(
        "new_note.html",
        fusenData = None
        )

@note_bp.route("/delete_note/<int:noteId>", methods=["DELETE"])
def delete_fusen(noteId : int):
    note_ctl = FusenService()
    if (not note_ctl.fusen_delete(noteId)):
        return jsonify({
            "success": False ,
            "message":msg.FUSEN_DATA_DELETE_ERROR
            })
    
    return jsonify({"success": True})

@note_bp.route("/edit_note/<int:noteId>", methods=["GET"])
def edit_fusen(noteId : int):
    note_ctl = FusenService()

    return render_template(
        "new_note.html",
        fusenData = note_ctl.fusen_read(noteId)
        )