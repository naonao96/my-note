from flask import request, jsonify, render_template, Blueprint, session
from app.dto.fusen_data import FusenData
from app.services.fusen_service import FusenService
from app.common.decorators import login_required
import app.common.consts as consts
import app.common.messages as msg
import logging

note_bp = Blueprint('notes', __name__, url_prefix='/note_list')

# -----Page Routes-----
@note_bp.route("/")
def startup():
    if session.get("user_id") is not None:
        return render_template_pack(consts.LIST_HTML_NAME, storage_mode=consts.LOGIN_MODE, dto_list=[])
    else:
        return render_template_pack(consts.LIST_HTML_NAME, storage_mode=consts.LOCAL_MODE, dto_list=[])

# -----API Routes-----
@note_bp.route("/api/notes", methods=["POST"])
@login_required
def create_fusen():
    try:
        service : FusenService = FusenService()
        dto : FusenData =set_fusen_data()
        service.fusen_create(dto)
        return jsonify({"success" : True}), 201
    except Exception as e:
        logging.exception(e)
        return jsonify({"success" : False}), 500 

# 付箋一覧を取得（全件取得）
@note_bp.route("/api/notes", methods=["GET"])
@login_required
def read_fusen_list():
    try:
        service : FusenService = FusenService()
        dict_list : list = []
        dto_list = service.fusen_all_read(session.get("user_id"))
        dict_list : list = [
            jsonify_data_pack(dto)
            for dto in dto_list
        ]
        return jsonify({"success" : True, "fusenList" : dict_list}), 200
    except Exception as e:
        logging.exception(e)
        return jsonify({"success" : False, "fusenList" : dict_list, "message" : msg.FUSEN_DATA_READ_ERROR}), 500

# 付箋を編集する際に使用するために作成したAPI（その他単独で付箋データを取得したい場合使用可能）
@note_bp.route("/api/notes/<int:fusenId>", methods=["GET"])
@login_required
def read_fusen(fusenId : int):
    try:
        service : FusenService = FusenService()
        dto_dict : dict = jsonify_data_pack(service.fusen_read(fusenId, session.get("user_id")))
        return jsonify({"success" : True, "fusenMode": consts.EDIT_MODE, "fusenData" : dto_dict}), 200
    except Exception as e:
        logging.exception(e)
        return jsonify({"success" : False, "fusenData" : None}), 500
    
@note_bp.route("/api/notes/<int:fusenId>", methods=["PUT"])
@login_required
def update_fusen(fusenId : int):
    try:
        service : FusenService = FusenService()
        dto : FusenData =set_fusen_data(fusenId)
        service.fusen_update(dto)
        return jsonify({"success" : True}), 200
    except Exception as e:
        logging.exception(e)
        return jsonify({"success" : False, "fusenMode" : consts.EDIT_MODE, "fusenData" : jsonify_data_pack(dto)}), 500

@note_bp.route("/api/notes/<int:fusenId>", methods=["DELETE"])
@login_required
def delete_fusen(fusenId : int):
    try: 
        service : FusenService = FusenService()
        service.fusen_delete(fusenId, session.get("user_id"))
        return jsonify({"success" : True}), 200
    except Exception as e:
        logging.exception(e)
        return jsonify({"success" : False}), 500

# -----モジュール共通関数-----
# フロントからの入力を受けDTOへデータをPack
def set_fusen_data(fusen_id : int | None = None) -> FusenData:
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        raise ValueError("JSON形式のリクエストデータが必要です")
    
    return FusenData(
        id= fusen_id,
        user_id=session.get("user_id"),
        content= data.get("content"),
        expires_at= data.get("expires_at"),
        color= data.get("color")
    )

# render_templateへデータをPack（冗長なため関数化）
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

# jsonifyでレスポンス時に使用するFusenData(DICT)を作成（冗長なため関数化）
def jsonify_data_pack(dto : FusenData) -> dict:
    return {
        "id" : dto.id,
        "user_id" : dto.user_id,
        "content" : dto.content,
        "created_at" : dto.created_at,
        "updated_at" : dto.updated_at,
        "expires_at" : dto.expires_at,
        "color" : dto.color,
        "status" : dto.status
    }
