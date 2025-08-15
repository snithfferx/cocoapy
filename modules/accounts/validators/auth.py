def validate_login_payload(data: dict) -> tuple[bool, str]:
    if not data.get("password"):
        return False, "Falta la contraseña"
    if not data.get("username") and not data.get("email"):
        return False, "Falta username o email"
    return True, ""

def validate_reset_payload(data: dict) -> tuple[bool, str]:
    """
    Valida que el payload tenga username o email para reset.
    """
    if not isinstance(data, dict):
        return False, "Formato inválido de datos"

    if not data.get("username") and not data.get("email"):
        return False, "Debes enviar username o email"

    return True, ""

def validate_reset_form_payload(data: dict) -> tuple[bool, str]:
    """
    Valida que el payload tenga token y password para reset.
    """
    if not isinstance(data, dict):
        return False, "Formato inválido de datos"

    if not data.get("token") and not data.get("password"):
        return False, "Debes enviar username o email"

    return True, ""