'''
Memo:notesは名前空間のようなもの
BlueprintはFlaskの機能で、アプリケーションのルーティングやビュー関数をグループ化するためのもの
url_prefixはこのBlueprintに属するすべてのルートのURLの前に付加されるプレフィックスを指定するためのもの
例えば、url_prefix='/note_list'と指定すると、このBlueprintに属するすべてのルートは
/note_listから始まるURLになります
'''
from flask import request, jsonify, render_template, Blueprint, redirect, url_for, session
from app.dto.fusen_data import FusenData
from app.services.fusen_service import FusenService
from app.common.decorators import login_required
import logging

note_bp = Blueprint('notes', __name__, url_prefix='/note_list')
LIST_HTML_NAME : str = "fusen_list.html"
EDIT_HTML_NAME : str = "fusen_edit.html"
CREATE_MODE : str = "create"
EDIT_MODE : str = "edit"

@note_bp.route("/")
@login_required
def index():
    service : FusenService = FusenService()
    dto_list : list
    try:
        dto_list = service.fusen_all_read(session.get("user_id"))
    except Exception as e:
        logging.exception(e)
        dto_list = []

    return render_template_pack(LIST_HTML_NAME, dto_list=dto_list)

@note_bp.route("/new_note", methods=["GET"])
@login_required
def open_create_window():
    return render_template_pack(EDIT_HTML_NAME, CREATE_MODE, None)

@note_bp.route("/edit_note/<int:fusenId>", methods=["GET"])
@login_required
def open_edit_window(fusenId : int):
    service : FusenService = FusenService()
    dto : FusenData
    try:
        dto = service.fusen_read(fusenId, session.get("user_id"))
    except Exception as e:
        logging.exception(e)
        return redirect(url_for("notes.index"))
        
    return render_template_pack(EDIT_HTML_NAME, EDIT_MODE, dto=dto)

@note_bp.route("/notes", methods=["POST"])
@login_required
def create_fusen():
    service : FusenService = FusenService()
    dto : FusenData =set_fusen_data()
    try:
        service.fusen_create(dto)
    except Exception as e:
        logging.exception(e)
        return render_template_pack(EDIT_HTML_NAME, CREATE_MODE, dto=dto)
    
    return redirect(url_for("notes.index"))
    
@note_bp.route("/notes/<int:fusenId>", methods=["POST"])
@login_required
def update_fusen(fusenId : int):
    service : FusenService = FusenService()
    dto : FusenData =set_fusen_data(fusenId)
    try:
        service.fusen_update(dto)
    except Exception as e:
        logging.exception(e)
        return render_template_pack(EDIT_HTML_NAME, EDIT_MODE, dto=dto)
    
    return redirect(url_for("notes.index"))

@note_bp.route("/delete_note/<int:fusenId>", methods=["DELETE"])
@login_required
def delete_fusen(fusenId : int):
    service : FusenService = FusenService()
    try: 
        service.fusen_delete(fusenId, session.get("user_id"))
    except Exception as e:
        logging.exception(e)
        return redirect(url_for("notes.index"))
    
    return jsonify()

# -------------------------------------------------------------
def set_fusen_data(fusen_id : int | None = None) -> FusenData:
    return FusenData(
        id= fusen_id,
        user_id=session.get("user_id"),
        content= request.form.get("content"),
        expires_at= request.form.get("expires_at"),
        color= request.form.get("color")
    )

def render_template_pack(html_name : str, config_mode : str = CREATE_MODE, dto : FusenData | None = None, dto_list : list | None = None):
    return render_template(
            html_name,
            mode=config_mode,
            fusenData=dto,
            fusenList=dto_list
        )