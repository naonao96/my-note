from app import db

class Fusen(db.Model):
    __tablename__ = "fusen"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False) 
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    expires_at = db.Column(db.Date, default=None)
    color = db.Column(db.String(20), default = "#A9CEEC")
    status = db.Column(db.String(40), default = "active")