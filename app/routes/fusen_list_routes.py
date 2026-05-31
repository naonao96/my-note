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
    fusen_serv = FusenService()

    return render_template(
        "notes_list.html",
        fusenList = fusen_serv.fusen_all_read()
    )

@note_bp.route("/new_note", methods=["GET"])
def open_create_window():
    return render_template(
        "new_note.html",
        mode= "create",
        fusenData = None
        )

@note_bp.route("/edit_note/<int:noteId>", methods=["GET"])
def open_edit_window(noteId : int):
    fusen_serv = FusenService()

    return render_template(
        "new_note.html",
        mode= "edit",
        fusenData = fusen_serv.fusen_read(noteId)
        )

# ここからCRUD処理　↓↓↓
@note_bp.route("/delete_note/<int:fusenId>", methods=["DELETE"])
def delete_fusen(fusenId : int):
    fusen_serv = FusenService()
    if (not fusen_serv.fusen_delete(fusenId)):
        return jsonify({
            "success": False ,
            "message":msg.FUSEN_DATA_DELETE_ERROR
            })
    
    return jsonify({"success": True})

@note_bp.route("/notes", methods=["POST"])
def create_fusen():
    note = FusenData(
        content = request.form.get("content"),
        expires_at= request.form.get("expires_at"),
        color= request.form.get("color")
    )
    
    fusen_serv = FusenService()
    res_create = fusen_serv.fusen_create(note)
    if not res_create["success"]:
        print(msg.FUSEN_DATA_CREATE_ERROR)

    return redirect(url_for("notes.index"))

@note_bp.route("/notes/<int:fusenId>", methods=["POST"])
def update_fusen(fusenId):
    fusen = FusenData(
        id= fusenId,
        content= request.form.get("content"),
        expires_at= request.form.get("expires_at"),
        color= request.form.get("color")
    )

    fusen_serv = FusenService()
    if not fusen_serv.fusen_update(fusen):
        print(msg.FUSEN_DATA_UPDATE_ERROR)
    
    return redirect(url_for("notes.index"))