from app import create_app, db
from app.routes.fusen_list_routes import note_bp
from app.main_routes import main_bp
from app.routes.auth_routes import auth_bp
from app.models.fusen_model import Fusen
from app.models.user_model import User

app = create_app()

app.register_blueprint(note_bp)
app.register_blueprint(main_bp)
app.register_blueprint(auth_bp)

with app.app_context():
    try:
        db.create_all()
        print("✅Database tables created successfully.")
    except Exception as e:
        print("❌Database connection failed:", e)

if __name__ == '__main__':     
    app.run(host="0.0.0.0", port=5000, debug=True)

    