from dataclasses import dataclass
from datetime import datetime, date

@dataclass
class Notes:
    id : int
    user_id : int
    content : str
    create_at : datetime| None = None
    update_at : datetime | None = None
    expires_at : date | None = None
    color : str ="#A9CEEC"
    status : str = "active"