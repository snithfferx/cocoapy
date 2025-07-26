from flask import Blueprint, request, jsonify
from modules.accounts.users.UsersController import read
from flask_jwt_extended import jwt_required

userBp = Blueprint("userBp", __name__, url_prefix="/user")
userBp.route("/profile", methods=["GET"])(jwt_required()(read))