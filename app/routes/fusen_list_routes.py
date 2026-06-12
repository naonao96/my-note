'''
Memo:notesは名前空間のようなもの
BlueprintはFlaskの機能で、アプリケーションのルーティングやビュー関数をグループ化するためのもの
url_prefixはこのBlueprintに属するすべてのルートのURLの前に付加されるプレフィックスを指定するためのもの
例えば、url_prefix='/note_list'と指定すると、このBlueprintに属するすべてのルートは
/note_listから始まるURLになります
'''
from flask import request, jsonify, render_template, Blueprint, redirect, url_for
from app.dto.fusen_data import FusenData
from app.services.fusen_service import FusenService

note_bp = Blueprint('notes', __name__, url_prefix='/note_list')

@note_bp.route("/")
def index():
    service : FusenService = FusenService()
    return render_template(
        "notes_list.html",
        fusenList=service.fusen_all_read()
    )

@note_bp.route("/new_note", methods=["GET"])
def open_create_window():
    return render_template(
        "new_note.html",
        mode="create",
        fusenData=None
    )

@note_bp.route("/edit_note/<int:fusenId>", methods=["GET"])
def open_edit_window(fusenId : int):
    service : FusenService = FusenService()
    dto : FusenData | None = service.fusen_read(fusenId)

    if dto is None:
        return redirect(url_for("notes.index"))

    return render_template(
        "new_note.html",
        mode="edit",
        fusenData=dto
    )

# ここからCRUD処理　↓↓↓
@note_bp.route("/delete_note/<int:fusenId>", methods=["DELETE"])
def delete_fusen(fusenId : int):
    service : FusenService = FusenService()
    res :dict = service.fusen_delete(fusenId)

    if not res.get("success"):
        print(res.get("message"))

    return jsonify(res)

@note_bp.route("/notes", methods=["POST"])
def create_fusen():
    dto : FusenData | None  = FusenData(
        content = request.form.get("content"),
        expires_at= request.form.get("expires_at"),
        color= request.form.get("color")
    )
    service : FusenService = FusenService()
    res : dict = service.fusen_create(dto)
    if not res.get("success"):
        return render_template(
            "new_note.html",
            mode="create",
            fusenData=dto,
            errorMessage=res.get("message")
        )

    return redirect(url_for("notes.index"))

@note_bp.route("/notes/<int:fusenId>", methods=["POST"])
def update_fusen(fusenId : int):
    dto : FusenData | None  = FusenData(
        id= fusenId,
        content= request.form.get("content"),
        expires_at= request.form.get("expires_at"),
        color= request.form.get("color")
    )
    service : FusenService = FusenService()
    res : dict = service.fusen_update(dto)

    if not res.get("success"):
        return render_template(
            "new_note.html",
            mode="edit",
            fusenData=dto,
            errorMessage=res.get("message")
        )
    
    return redirect(url_for("notes.index"))