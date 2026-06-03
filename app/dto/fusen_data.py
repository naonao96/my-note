from dataclasses import dataclass
from datetime import datetime, date
from app.models.fusen_model import Fusen

@dataclass
class FusenData:
    id : int | None = None
    # ユーザーIDはログイン機能実装後解禁
    # user_id : UUID | None = None
    content : str = ""
    created_at : datetime| None = None
    updated_at : datetime | None = None
    expires_at : date | None = None
    color : str ="#A9CEEC"
    status : str = "active"

    @staticmethod
    def from_model(model : Fusen):
        fusen_data : FusenData = FusenData(
            id = model.id,
            content= model.content,
            created_at= model.created_at,
            updated_at= model.updated_at,
            expires_at= model.expires_at,
            color= model.color,
            status= model.status
        )
        return fusen_data