from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash,check_password_hash
from modules.accounts.users.UsersController import create, readByName, readByEmail, exist


def userLogin(username,email, password):
    xsts = exist(username, email)
    if not xsts:
        return {"error": "Credenciales inválidas", "code": 401}

    user = None
    if username and not email:
        user = readByName(username)
    elif email and not username:
        user = readByEmail(email)
    elif username and email:
        # Prefer username if both are provided
        user = readByName(username)
    else:
        return {"error": "Credenciales inválidas", "code": 401}

    if not user or not check_password_hash(user["password"], password):
        return {"error": "Credenciales inválidas", "code": 401}

    access_token = create_access_token(identity=user["id"])
    return {"message": "Login exitoso", "token": access_token, "code":200}

def userRegistration(username,email, password):
    if not username or not email or not password:
        return {"error": "Faltan campos", "code": 400}
    
    hashed_pw = generate_password_hash(password)
    try:
        user = create({
            "username": username,
            "email": email,
            "password": hashed_pw
        })
        if "error" in user:
            return {"error": user["error"], "code": 400}
        return {"message": "Usuario registrado exitosamente", "code":201,"redirect":"login"}
    except Exception as err:
        return {"error": str(err), "code": 500}