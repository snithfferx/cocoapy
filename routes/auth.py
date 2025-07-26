from modules.accounts.auth.AuthController import userRegistration, userLogin
from flask import Blueprint

authBp = Blueprint("authBp", __name__, url_prefix="/auth")

authBp.route("/register", methods=["POST"]) #(userRegistration)
def register():
    if not request.json or "password" not in request.json:
        return jsonify({"error": "Credenciales inválidas"}), 400

    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    user = userRegistration(username, email, password)
    if "error" in user:
        return jsonify({"error": user["error"]}), 400
    else:
        return jsonify({"message": "Registro exitoso"}), 201
authBp.route("/login", methods=["POST"]) #(userLogin)
def login():
    if not request.json or "password" not in request.json:
        return jsonify({"error": "Credenciales inválidas"}), 400
    data = request.json
    username = data.get("username")
    password = data.get("password")
    user = userLogin(username, password)
    if "error" in user:
        return jsonify({"error": user["error"]}), 400
    else:
        return jsonify({"message": "Inicio de sesión exitoso"}), 200
# authBp.route("/login", methods=["POST"])(userLogin)