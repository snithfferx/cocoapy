from flask import Blueprint
from modules.accounts.users.UsersController import read
from flask_jwt_extended import jwt_required, jwt_required, get_jwt_identity

userBp = Blueprint("userBp", __name__, url_prefix="/user")
userBp.route("/profile", methods=["GET"])(jwt_required()(read))