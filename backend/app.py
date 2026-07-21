from flask import Flask
from flask_cors import CORS
import pymysql

from config import Config
from extensions import db
from routes import register_routes

pymysql.install_as_MySQLdb()

app = Flask(__name__)

app.config.from_object(Config)

CORS(app)

db.init_app(app)

register_routes(app)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )
