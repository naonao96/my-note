from dataclasses import dataclass
from datetime import datetime, date

@dataclass
class FusenData:
    id : int | None = None
    # ユーザーIDはログイン機能実装後解禁
    # user_id : UUID | None = None
    content : str = ""
    create_at : datetime| None = None
    update_at : datetime | None = None
    expires_at : date | None = None
    color : str ="#A9CEEC"
    status : str = "active"