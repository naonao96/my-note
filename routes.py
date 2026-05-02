from app import app

@app.route("/")
def route():
    return "<h1>毎日ノート</h1>"

