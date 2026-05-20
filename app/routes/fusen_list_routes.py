from flask import request, jsonify, render_template, Blueprint, redirect, url_for
from app.dto.fusen_data import FusenData
from app.services.fusen_service import FusenService as fusen_service

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
    note_ctl = fusen_service()
    fusen_list = note_ctl.all_read_fusen()

    return render_template(
        "notes_list.html",
        fusenList = fusen_list
    )

@note_bp.route("/notes", methods=["POST"])
def create_note():
    note = FusenData(
        content = request.form.get("content"),
        expires_at= request.form.get("expires_at"),
        color= request.form.get("color")
    )
    
    note_ctl = fusen_service()
    res_create = note_ctl.create_note(note)
    print(res_create)

    return redirect(url_for("notes.index"))

# @note_bp.route("/notes", methods=["GET"])
# def get_notes():
    # 今後API化可能性を考慮し残している。
    
@note_bp.route("/new_note", methods=["GET"])
def new_note():
    return render_template("new_note.html")
