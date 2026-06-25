from flask import request, jsonify, render_template, Blueprint, redirect, url_for, session
from app.dto.fusen_data import FusenData
from app.services.fusen_service import FusenService
from app.common.decorators import login_required
import logging
import app.common.consts as consts

note_bp = Blueprint('notes', __name__, url_prefix='/note_list')

@note_bp.route("/")
def startup():
    is_logged_in : bool = session.get("user_id") is not None
    if is_logged_in:
        return render_template_pack(consts.LIST_HTML_NAME, storage_mode=consts.LOGIN_MODE, dto_list=[])
    return render_template_pack(consts.LIST_HTML_NAME, storage_mode=consts.LOCAL_MODE, dto_list=[])

@note_bp.route("/new_note", methods=["GET"])
@login_required
def open_create_window():
    return render_template_pack(consts.EDIT_HTML_NAME, consts.CREATE_MODE, None)

# API -----------------------------------------------------------------------------------------------------
@note_bp.route("/api/read_list")
@login_required
def index():
    service : FusenService = FusenService()
    try:
        dto_list : list = service.fusen_all_read(session.get("user_id"))
    except Exception as e:
        logging.exception(e)
        dto_list = []

    return render_template_pack(consts.LIST_HTML_NAME, dto_list=dto_list)

@note_bp.route("/api/edit/<int:fusenId>", methods=["GET"])
@login_required
def open_edit_window(fusenId : int):
    service : FusenService = FusenService()
    dto : FusenData
    try:
        dto = service.fusen_read(fusenId, session.get("user_id"))
    except Exception as e:
        logging.exception(e)
        return redirect(url_for("notes.index"))
        
    return render_template_pack(consts.EDIT_HTML_NAME, consts.EDIT_MODE, dto=dto)

@note_bp.route("/api/create", methods=["POST"])
@login_required
def create_fusen():
    service : FusenService = FusenService()
    dto : FusenData =set_fusen_data()
    try:
        service.fusen_create(dto)
    except Exception as e:
        logging.exception(e)
        return render_template_pack(consts.EDIT_HTML_NAME, consts.CREATE_MODE, dto=dto)
    
    return redirect(url_for("notes.index"))
    
@note_bp.route("/api/update/<int:fusenId>", methods=["POST"])
@login_required
def update_fusen(fusenId : int):
    service : FusenService = FusenService()
    dto : FusenData =set_fusen_data(fusenId)
    try:
        service.fusen_update(dto)
    except Exception as e:
        logging.exception(e)
        return render_template_pack(consts.EDIT_HTML_NAME, consts.EDIT_MODE, dto=dto)
    
    return redirect(url_for("notes.index"))

@note_bp.route("/api/delete/<int:fusenId>", methods=["DELETE"])
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

def render_template_pack(
        html_name : str, 
        storage_mode : str = consts.LOCAL_MODE, 
        fusen_mode : str = consts.CREATE_MODE, 
        dto : FusenData | None = None, 
        dto_list : list | None = None
        ):
    return render_template(
            html_name,
            storageMode=storage_mode,
            fusenMode=fusen_mode,
            fusenData=dto,
            fusenList=dto_list
        )