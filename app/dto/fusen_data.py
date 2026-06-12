from dataclasses import dataclass
from datetime import datetime, date
from app.models.fusen_model import Fusen
import app.common.util as util

@dataclass
class FusenData:
    id : int | None = None
    user_id : int | None = None
    content : str = ""
    created_at : datetime| None = None
    updated_at : datetime | None = None
    expires_at : date | None = None
    color : str ="#A9CEEC"
    status : str = "active"

    @staticmethod
    def from_model(model : Fusen):
        return FusenData(
            id = model.id,
            user_id=model.user_id,
            content= model.content,
            created_at= model.created_at,
            updated_at= model.updated_at,
            expires_at= model.expires_at,
            color= model.color,
            status= model.status
        )
    @staticmethod
    def to_model(fusen_data : FusenData) -> Fusen:
        return Fusen(
            id= fusen_data.id,
            user_id=fusen_data.user_id,
            content = fusen_data.content,
            expires_at = util.empty_to_none(fusen_data.expires_at),
            color = fusen_data.color
        )