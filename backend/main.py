import os
from dotenv import load_dotenv
# Flask importados
from flask import Flask #, g, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
# Importar rutas
from routes.auth import authBp
from routes.user import userBp
from routes.counter import counterBp

def create_app():
    load_dotenv()
    # Env variables
    ALLOWED_HOST= os.getenv('ALLOWED_ORIGIN')
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET")  # Agrega esto a tu .env
    app.config["ALLOWED_ORIGIN"] = os.getenv("ALLOWED_ORIGIN", "*")
    jwt = JWTManager(app)
    CORS(app, resources={r"/api/*": {"origins": [ALLOWED_HOST]}}, supports_credentials=True)
    app.register_blueprint(authBp)
    app.register_blueprint(userBp)
    app.register_blueprint(counterBp)

    return app