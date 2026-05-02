from app import create_app, db
from routes import register_routes

app = create_app()
register_routes(app)

if __name__ == '__main__':
    with app.app_context():
        try:
            db.session.execute(db.text("SELECT 1"))
            print("✅Database connection successful.")
            db.create_all()
            print("✅Database tables created successfully.")
        except Exception as e:
            print("❌Database connection failed:", e)
        
    app.run(debug=True)

    