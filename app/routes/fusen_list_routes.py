from flask import request, jsonify, render_template, Blueprint, session
from app.dto.fusen_data import FusenData
from app.dto.user_data import UserData
from app.services.fusen_service import FusenService
from app.services.users_service import UserService
from app.common.decorators import api_login_required
from app.common.exceptions import FusenNotFoundError, ValidationError
import app.common.consts as consts
import app.common.messages as msg
import logging

note_bp = Blueprint('notes', __name__, url_prefix='/note_list')

# -----Page Routes-----
@note_bp.route("/")
def startup():
    # ログイン済み：LOGIN_MODE｜ゲストモード：LOCAL_MODE
    user_id: int | None = session.get("user_id")
    if user_id is not None:
        service: UserService = UserService()
        user_data: UserData | None = service.user_read_by_user_id(user_id)
        return render_template_pack(consts.LIST_HTML_NAME, storage_mode=consts.LOGIN_MODE, dto_list=[], user_data=user_data)
    else:
        return render_template_pack(consts.LIST_HTML_NAME, storage_mode=consts.LOCAL_MODE, dto_list=[], user_data=None)

@note_bp.route("/offline")
def offline():
    return render_template_pack(consts.OFFLINE_HTML_NAME)

# -----API Routes-----
@note_bp.route("/api/notes", methods=["POST"])
@api_login_required
def create_fusen():
    try:
        service : FusenService = FusenService()
        dto : FusenData =set_fusen_data()
        created_fusen: FusenData = service.fusen_create(dto)
        return jsonify({"success": True, "id": created_fusen.id}), 201
    except ValidationError:
        return jsonify({"success": False, "id": None}), 400 
    except Exception as e:
        logging.exception(e)
        return jsonify({"success": False, "id": None}), 500 

@note_bp.route("/api/notes", methods=["GET"])
@api_login_required
def read_fusen_list():
    '''付箋一覧を取得（全件取得）'''
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

@note_bp.route("/api/notes/<int:fusenId>", methods=["GET"])
@api_login_required
def read_fusen(fusenId : int):
    '''付箋を編集する際に使用するために作成したAPI（その他単独で付箋データを取得したい場合使用可能）'''
    try:
        service : FusenService = FusenService()
        dto_dict : dict = jsonify_data_pack(service.fusen_read(fusenId, session.get("user_id")))
        return jsonify({"success" : True, "fusenMode": consts.EDIT_MODE, "fusenData" : dto_dict}), 200
    except FusenNotFoundError:
        return jsonify({"success": False, "fusenData": None}), 404
    except Exception as e:
        logging.exception(e)
        return jsonify({"success" : False, "fusenData" : None}), 500
    
@note_bp.route("/api/notes/<int:fusenId>", methods=["PUT"])
@api_login_required
def update_fusen(fusenId : int):
    try:
        service : FusenService = FusenService()
        dto : FusenData = set_fusen_data(fusenId)
        service.fusen_update(dto)
        return jsonify({"success": True}), 200
    except ValidationError:
        return jsonify({"success": False, "fusenData": None}), 400
    except FusenNotFoundError:
        return jsonify({"success": False, "fusenMode": consts.EDIT_MODE, "fusenData": None}), 404 
    except Exception as e:
        logging.exception(e)
        return jsonify({"success": False, "fusenMode": consts.EDIT_MODE, "fusenData": None}), 500

@note_bp.route("/api/notes/<int:fusenId>", methods=["DELETE"])
@api_login_required
def delete_fusen(fusenId : int):
    try: 
        service : FusenService = FusenService()
        service.fusen_delete(fusenId, session.get("user_id"))
        return jsonify({"success" : True}), 200
    except FusenNotFoundError:
        return jsonify({"success" : False}), 404 
    except Exception as e:
        logging.exception(e)
        return jsonify({"success" : False}), 500

# ----- Helper Functions -----
def set_fusen_data(fusen_id : int | None = None) -> FusenData:
    '''フロントからの入力を受けDTOへデータをPack'''
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        raise ValidationError("JSON形式のリクエストデータが必要です")
    
    return FusenData(
        id= fusen_id,
        user_id=session.get("user_id"),
        content= data.get("content"),
        expires_at= data.get("expires_at"),
        color= data.get("color")
    )

def render_template_pack(
        html_name: str, 
        storage_mode: str = consts.LOCAL_MODE, 
        fusen_mode: str = consts.CREATE_MODE, 
        dto: FusenData | None = None, 
        dto_list: list | None = None,
        user_data: UserData  | None = None
        ):
    '''render_templateへデータをPack（冗長なため関数化）'''
    return render_template(
            html_name,
            storageMode=storage_mode,
            fusenMode=fusen_mode,
            fusenData=dto,
            fusenList=dto_list,
            userData=user_data
        )

def jsonify_data_pack(dto : FusenData) -> dict:
    '''jsonifyでレスポンス時に使用するFusenData(DICT)を作成（冗長なため関数化）'''
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
