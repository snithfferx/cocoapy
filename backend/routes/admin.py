from flask import Blueprint
from middlewares.roles import requires_role
from flask import current_app
from middlewares.req_res import get_json, success

adminBp = Blueprint("admin", __name__, url_prefix="/admin")
def origin():
    # Lee el origen permitido desde la config de la app
    return current_app.config.get("ALLOWED_ORIGIN", "*")

@adminBp.route("/dashboard", methods=["GET"])
@requires_role("admin")
def dashboard():
    data = get_json()
    return success("Bienvenido, admin", data, 200)

@adminBp.route("/create-user", methods=["POST"])
@requires_role("admin")
def createUser():
    data = get_json()
    return success("Usuario creado exitosamente", None, 200)

@adminBp.route("/update-user", methods=["POST"])
@requires_role("admin")
def updateUser():
    data = get_json()
    return success("Usuario actualizado exitosamente", None, 200)
@adminBp.route("/users", methods=["GET"])
@requires_role("admin")
def getUsers():
    data = get_json()
    return success("Usuarios obtenidos exitosamente", data, 200)
@adminBp.route("/users/<int:id>/role", methods=["PUT"])
@requires_role("admin")
def updateUserRole(id):
    data = get_json()
    return success("Rol actualizado exitosamente", None, 200)