from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt

def requires_role(*allowed_roles):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            try:
                verify_jwt_in_request()
                claims = get_jwt()
                user_role = claims.get("role")
                if user_role not in allowed_roles:
                    return jsonify({"status": "error", "message": "Acceso denegado: rol insuficiente"}), 403
            except Exception as e:
                return jsonify({"status": "error", "message": f"Error de autenticación: {str(e)}"}), 401
            return fn(*args, **kwargs)
        return decorator
    return wrapper