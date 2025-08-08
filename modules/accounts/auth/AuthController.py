from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash,check_password_hash
from modules.accounts.users.UsersController import create, readByName, readByEmail, exist
from modules.accounts.sessions.SessionsController import create as createSession, read as readSession, validateSession, update as updateSession, delete as deleteSession,saveTempSession
from modules.emails.EmailsController import send_email
import time

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

    if not user or not check_password_hash(str(user["password"]), password):
        return {"error": "Credenciales inválidas", "code": 401}

    access_token = create_access_token(identity=user["id"])
    # Save session data
    try:
        userID = int(user["id"])
        expiration = time.time() + ((60 * 60) * 4)  # 4 hours
        sessionId = None
        if validateSession(userID):
            session = readSession(userID)
            # if it exists verify if the session is valid
            if session["expire"] > expiration:
                # Update session if it exists but is expired
                essionUpdated = updateSession(userID, access_token, expiration)
                if "error" in essionUpdated:
                    return {"error": essionUpdated["error"], "code": 500}
                sessionId = session["id"]
            else:
                # Delete the old session
                oldSession = deleteSession(userID)
                if "error" in oldSession:
                    return {"error": oldSession["error"], "code": 500}
        else:
            # Create a new session
            newSession = createSession(userID,access_token,expiration)
            if "error" in newSession:
                return {"error": newSession["error"], "code": 500}
            sessionId = newSession["id"]
        return {
            "message": "Login exitoso", 
            "data": {
                "token":access_token,
                "expiration":expiration,
                "user":{
                    "id":userID,
                    "name":user["username"],
                    "email":user["email"],
                    "role":user["role"],
                },
                "sessionID":sessionId
            }, "code":200}
    except Exception as e:
        return {"error": f"Error al crear sesión: {str(e)}", "code": 500}

def userRegistration(username,email, password):
    if not username or not email or not password:
        return {"status": "error","message": "Faltan campos", "code": 400}
    
    hashed_pw = generate_password_hash(password)
    try:
        user = create({
            "username": username,
            "email": email,
            "password": hashed_pw
        })
        if user["status"] == "error":
            return {"status": user["status"],"message":user["message"], "code": 400}
        return user
    except Exception as err:
        return {"status": "error","message":f"Error al crear usuario {err}", "code": 500}

def userResetPassword(username,email):
    if not username or not email:
        return {"error": "Faltan campos", "code": 400}
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
            return {"error": "Credenciales inválidas", "code": 401}
        
        if not user:
            return {"error": "Usuario no encontrado", "code": 404}

        # Generate reset token
        reset_token = generate_password_hash(str(user["id"]))
        # Save reset token
        tempSession = saveTempSession(int(user["id"]), reset_token, time.time() + (60 * 60))
        if "error" in tempSession:
            return {"error": tempSession["error"], "code": 500}
        # Send token to email
        send_email(user["email"], "Reset-Password", {"token": reset_token}, "reset_password")
        return {"message": "Contraseña restablecida exitosamente", "code":200}
    except Exception as err:
        return {"error": str(err), "code": 500}

def verifyEmail(token):
    if not token:
        return {"error": "Faltan campos", "code": 400}
    try:
        user = None
        if token:
            # user = readByToken(token)
            # TODO - Implement function to fetch user by token payload
        else:
            return {"error": "Credenciales inválidas", "code": 401}
        
        if not user:
            return {"error": "Usuario no encontrado", "code": 404}

        # Generate reset token
        reset_token = generate_password_hash(str(user["id"]))
        # Save reset token
        tempSession = saveTempSession(user["id"], reset_token, time.time() + (60 * 60))
        if "error" in tempSession:
            return {"error": tempSession["error"], "code": 500}
        # Send token to email
        send_email(user["email"], "Reset-Password", {"token": reset_token}, "reset_password")
        return {"message": "Contraseña restablecida exitosamente", "code":200}
    except Exception as err:
        return {"error": str(err), "code": 500}
