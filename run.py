from app import create_app, db
from app.routes.note_list_routes import note_bp
from app.main_routes import main_bp

app = create_app()

app.register_blueprint(note_bp)
app.register_blueprint(main_bp)

with app.app_context():
    try:
        db.create_all()
        print("✅Database tables created successfully.")
    except Exception as e:
        print("❌Database connection failed:", e)

if __name__ == '__main__':     
    app.run(debug=True)

    