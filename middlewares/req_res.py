def get_json():
    """Obtiene JSON de forma segura."""
    return request.get_json(silent=True) or {}

def bad_request(msg="Credenciales inválidas"):
    """Devuelve una respuesta con un error."""
    return jsonify({"ok": False, "error": msg}), 400

def success(payload=None, status=200):
    """Devuelve una respuesta exitosa."""
    return jsonify({"ok": True, "data": payload or {}}), status

