from modules.accounts.sessions.SessionModel import getOne, add, exists, remove,edit,getTempSession,addTempSession
from modules.core.controller import response
import time

def create(user: int, token: str, expire: float) -> dict[str,str|int|float]:
    if exists(user):
        return response("Session already exists for user",None,400)
    
    result = add(user, token, expire)
    if not result:
        return response("error", "Failed to create session",None,500)
    
    return response(f"Session created for user {user}", {"id": result['id'],"token": token, "expire": expire})

def read(user: int) -> dict:
    session = getOne(user)
    if not session:
        return response("No session found for user",None,404)
    return session

def update(user: int, token: str, expire: float) -> dict[str,str]:
    if not exists(user):
        return response("No session found for user",None,404)
    result = edit(user, token, expire)
    if "Error" in result:
        return response("Error updating session", result)
    return response(f"Session updated for user {user}",result,200)

def delete(user: int) -> dict:
    if not exists(user):
        return response("No session found for user",None,404)
    result = remove(user)  # Assuming this deletes the session
    if result != True:
        return response("Error deleting session", result["Error"])
    return response(f"Session deleted for user {user}",result,200)

def validateSession(user: int) -> bool:
    # Check if the session exists and is valid
    session = exists(user)
    if not session:
        return False
    # IF session exists, get session data
    session = read(user)
    # Verify if the session is still valid
    if session['expire'] > time.time():
        return True
    return False

def readTempSession(user: int) -> dict[str,str]:
    result = getTempSession(user)
    return result

def saveTempSession(user: int, token: str, expire: float) -> dict[str,str]:
    result = addTempSession(user, token, expire)
    if "Error" in result:
        return response("Error saving temp session", result)
    return response(f"Session guardada exitosamente para el usuario {user}",result,200)

def getTempSessionByToken(token: str) -> dict[str,str]:
    result = getByToken(token)
    if "Error" in result:
        return response("Error getting temp session", result)
    return response("Session encontrada exitosamente",result,200)