from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash,check_password_hash
from modules.accounts.users.UsersController import create, readByName, readByEmail, exist
from modules.accounts.sessions.SessionsController import create as createSession, read as readSession, validateSession, update as updateSession, delete as deleteSession,saveTempSession
from modules.emails.EmailsController import send_email
from modules.core.controller import response
import time
import secrets

ALLOWED_ROLES = {"admin", "user"}

def userLogin(username,email, password):
    xsts = exist(username, email)
    if not xsts:
        return response("Credenciales inválidas", None, 401)

    user = None
    if username and not email:
        user = readByName(username)
    elif email and not username:
        user = readByEmail(email)
    elif username and email:
        # Prefer username if both are provided
        user = readByName(username)
    else:
        return response("Credenciales inválidas", None, 401)

    if not user or not check_password_hash(str(user["password"]), password):
        return response("Credenciales inválidas", None, 401)
    # Claims con rol (y útiles en UI)
    additional_claims = {
        "role": user["role"],
        "username": user["username"],
        "email": user["email"],
    }
    access_token = create_access_token(identity=user["id"], additional_claims=additional_claims)
    # Save session data
    try:
        userID = int(user["id"])
        now = time.time()
        expiration = now + ((60 * 60) * 4)  # 4 hours
        sessionId = None
        if validateSession(userID):
            session = readSession(userID)
            # si ya expiró, elimina; sino, rota token/expiración
            if session["expire"] <= now:
                deleted = deleteSession(userID)
                if "error" in deleted:
                    return response("Error al eliminar sesión", deleted["error"], None, 500)
                created = createSession(userID, access_token, expiration)
                if "error" in created:
                    return response("Error al crear sesión", created["error"], None, 500)
                sessionId = created["id"]
            else:
                updated = updateSession(userID, access_token, expiration)
                if "error" in updated:
                    return response(updated["error"], None, 500)
                sessionId = session["id"]
        else:
            # Create a new session
            newSession = createSession(userID,access_token,expiration)
            if "error" in newSession:
                return response("Error al crear sesión", newSession["error"], None, 500)
            sessionId = newSession["id"]
        return response("Login exitoso", {
                "token":access_token,
                "expiration":expiration,
                "now":now,
                "user":{
                    "id":userID,
                    "name":user["user_name"],
                    "email":user["email"],
                    "role":user["role"],
                },
                "sessionID":sessionId
            }, 200)
    except Exception as e:
        return response(f"Error al crear sesión: {str(e)}", None, 500)

def userRegistration(username,email, password):
    if not username or not email or not password:
        return response("Faltan campos", None, 400)
    # Normaliza rol: default user si no viene o es inválido
    role = role if role in ALLOWED_ROLES else "user"
    # Genera hash de contraseña
    hashed_pw = generate_password_hash(password)
    try:
        user = create({
            "username": username,
            "email": email,
            "password": hashed_pw,
            "role": role
        })
        # Generate verification token
        # verification_token = generate_password_hash(str(user["id"]))
        verification_token = secrets.token_urlsafe(32)
        # Save verification token
        tempSession = saveTempSession(int(user["id"]), verification_token, time.time() + (60 * 60))
        if "error" in tempSession:
            return response("Error al guardar token", tempSession["error"], None, 500)
        # Send verification email
        send_email(email, "Verify Email", {"token": verification_token}, "verify_email")
        if user["status"] == "error":
            return response(user["message"], None, 400)
        return response("success", "Correo verificado exitosamente", None, 200)
    except Exception as err:
        return response(f"Error al crear usuario {err}", None, 500)

def userResetPasswordRequest(username,email):
    if not username or not email:
        return response("Faltan campos", None, 400)
    try:
        user = None
        if username and not email:
            user = readByName(username)
        elif email and not username:
            user = readByEmail(email)
        elif username and email:
            # Prefer username if both are provided
            user = readByName(username)
        else:
            return response("Credenciales inválidas", None, 401)
        
        if not user:
            return response("Usuario no encontrado", None, 404)

        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        # Save reset token
        tempSession = saveTempSession(int(user["id"]), reset_token, time.time() + (60 * 60))
        if "error" in tempSession:
            return response("Error al guardar token", tempSession["error"], None, 500)
        # Send token to email
        send_email(user["email"], "Reset-Password", {"token": reset_token}, "reset_password")
        return response("success", "Contraseña restablecida exitosamente", None, 200)
    except Exception as err:
        return response("Error al restablecer contraseña", str(err), None, 500)

def userResetPassword(token,password):
    if not token or not password:
        return response("Faltan campos", None, 400)
    try:
        user = None
        if token:
            # extract user id from token
            session = getTempSessionByToken(token)
            if "Error" in session:
                return response("Error al obtener token", session["error"], None, 401)
            user = session["user_id"]
        else:
            return response("Credenciales inválidas", None, 401)
        
        if not user:
            return response("Usuario no encontrado", None, 404)

        # log activity
        log = addLog(user["id"], "reset_password")
        if "error" in log:
            return response("Error al registrar actividad", log["error"], None, 500)
        
        # update password
        hashed_pw = generate_password_hash(password)
        updated = update(user["id"], hashed_pw)
        if "error" in updated:
            return response("Error al actualizar contraseña", updated["error"], None, 500)
        return response("success", "Contraseña restablecida exitosamente", None, 200)
    except Exception as err:
        return response("Error al restablecer contraseña", str(err), None, 500)

def verifyEmail(token):
    if not token:
        return response("Faltan campos", None, 400)
    try:
        user = None
        if token:
            # extract user id from token
            session = getTempSessionByToken(token)
            if "Error" in session:
                return response("Error al obtener token", session["error"], None, 401)
            user = session["user_id"]
        else:
            return response("Credenciales inválidas", None, 401)
        
        if not user:
            return response("Usuario no encontrado", None, 404)

        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        # Save reset token
        tempSession = saveTempSession(user["id"], reset_token, time.time() + (60 * 60))
        if "error" in tempSession:
            return response("Error al guardar token", tempSession["error"], None, 500)
        # Send token to email
        send_email(user["email"], "Reset-Password", {"token": reset_token}, "reset_password")
        return response("success", "Correo verificado exitosamente", None, 200)
    except Exception as err:
        return response("Error al verificar correo", str(err), None, 500)
