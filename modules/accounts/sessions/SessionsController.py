from modules.accounts.sessions.SessionModel import getOne, add, exists, remove,edit,getTempSession,addTempSession


import time

def create(user: int, token: str, expire: float) -> dict[str,str|int|float]:
    if exists(user):
        return {"error": "Session already exists for user"}
    
    result = add(user, token, expire)
    if not result:
        return {"error": "Failed to create session"}
    
    return {"message": f"Session created for user {user}", "id": result['id'],"token": token, "expire": expire}

def read(user: int) -> dict:
    session = getOne(user)
    if not session:
        return {"error": "No session found for user"}
    return session

def update(user: int, token: str, expire: float) -> dict[str,str]:
    if not exists(user):
        return {"error": "No session found for user"}
    result = edit(user, token, expire)
    if "Error" in result:
        return {"error": result}
    return {"message": f"Session updated for user {user}"}

def delete(user: int) -> dict:
    if not exists(user):
        return {"error": "No session found for user"}
    result = remove(user)  # Assuming this deletes the session
    if result != True:
        return {"error": result["Error"]}
    return {"message": f"Session deleted for user {user}"}

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
        return {"error": result}
    return {"message": f"Session updated for user {user}"}