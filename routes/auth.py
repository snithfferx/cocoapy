from modules.accounts.auth.AuthController import userRegistration, userLogin, userResetPassword, verifyEmail
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from dotenv import load_dotenv
import os
load_dotenv()

authBp = Blueprint("authBp", __name__, url_prefix="/auth")

@authBp.route("/register", methods=["POST", "OPTIONS"])
@cross_origin(origins=os.getenv("ALLOWED_ORIGIN"), supports_credentials=True)#(userRegistration)
def register():
    if not request.json or "password" not in request.json:
        return jsonify({"error": "Credenciales inválidas"}), 400

    data = request.json
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")
    user = userRegistration(username, email, password)
    return jsonify(user), int(user["code"])

@authBp.route("/login", methods=["POST", "OPTIONS"])
@cross_origin(origins=os.getenv("ALLOWED_ORIGIN"), supports_credentials=True)#(userLogin)
def login():
    if not request.json or "password" not in request.json:
        return jsonify({"error": "Credenciales inválidas"}), 400
    
    data = request.json
    username = data.get("username")
    password = data.get("password")
    email = data.get("email", None)
    user = userLogin(username, email, password)
    if "error" in user:
        return jsonify({"error": user["error"]}), 400
    else:
        return jsonify({"message": "Inicio de sesión exitoso"}), 200

@authBp.route("/reset-password", methods=["POST", "OPTIONS"])
@cross_origin(origins=os.getenv("ALLOWED_ORIGIN"), supports_credentials=True)
def reset_password():
    if not request.json or "password" not in request.json:
        return jsonify({"error": "Credenciales inválidas"}), 400
    
    data = request.json
    username = data.get("username")
    email = data.get("email", None)
    user = userResetPassword(username, email)
    if "error" in user:
        return jsonify({"error": user["error"]}), 400
    else:
        return jsonify({"message": "Inicio de sesión exitoso"}), 200

@authBp.route("/verify-email", methods=["POST", "OPTIONS"])
@cross_origin(origins=os.getenv("ALLOWED_ORIGIN"), supports_credentials=True)
def verify_email():
    if not request.json or "token" not in request.json:
        return jsonify({"error": "Credenciales inválidas"}), 400
    
    data = request.json
    token = data.get("token")
    user = verifyEmail(token)
    if "error" in user:
        return jsonify({"error": user["error"]}), 400
    else:
        return jsonify({"message": "Inicio de sesión exitoso"}), 200