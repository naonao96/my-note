from dataclasses import dataclass
from datetime import datetime
from app.models.user_model import User

@dataclass
class UserData:
    id : int | None = None
    google_id : str = ""
    email : str = ""
    name : str = ""
    picture : str = ""
    created_at : datetime | None = None
    updated_at : datetime | None = None

    @staticmethod
    def from_model(model : User):
        return UserData(
            id=model.id,
            google_id=model.google_id,
            email=model.email,
            name=model.name,
            picture=model.picture,
            created_at=model.created_at,
            updated_at=model.updated_at
        )
    
    @staticmethod
    def to_model(user_data : UserData) -> User:
        return User(
            id= user_data.id,
            google_id= user_data.google_id,
            email=user_data.email,
            name= user_data.name,
            picture=user_data.picture,
            created_at=user_data.created_at,
            updated_at=user_data.updated_at
        )