from modules.core.connection import (insertData, updateData, deleteData, selectData)

def exists(user:int) -> bool:
    try:
        sql = "SELECT COUNT(*) FROM sessions WHERE user_id = %s"
        params = (user,)
        xsts = selectData(sql, params)
        if xsts is None:
            return False
        if len(xsts) > 0:
            return True
        return False
    except Exception as err:
        return {"Error": f"Error al verificar sesión: {err}"}

def getOne(user:int) -> dict:
    try:
        sql = "SELECT * FROM sessions WHERE user_id = %s"
        params = (user,)
        session = selectData(sql, params)
        if session is None:
            return {}
        return session
    except Exception as err:
        return {"Error": f"Error al obtener sesión: {err}"}

def add(user:int, token:str, expire:float) -> dict:
    if exists(user):
        sql = "DELETE FROM sessions WHERE user_id = %s"
        params = (user,)
        deleteData(sql, params)
    try:
        sql = "INSERT INTO users (user_id, session_token, expiration) VALUES (%s, %s, %s)"
        params = (user, token, expire)
        result = insertData(sql, params)
        if result is None:
            return {"Error": "No se pudo agregar la sesión"}
        return result
    except Exception as err:
        return {"Error": f"Error al agregar sesión: {err}"}

def edit (user:int, token:str, expire:float) -> dict[str,str]:
    try:
        sql = "UPDATE sessions SET session_token = %s, expiration = %s WHERE user_id = %s"
        params = (token, expire, user)
        updateData(sql, params)
        return {"message": f"Sesión actualizada para el usuario {user}"}
    except Exception as err:
        return {"Error": f"Error al actualizar sesión: {err}"}

def remove(user:int) -> bool|dict[str,str]:
    try:
        sql = "DELETE FROM sessions WHERE user_id = %s"
        params = (user,)
        deleteData(sql, params)
        return True
    except Exception as err:
        return {"Error":"Error al eliminar sesión: {err}"}

def getTempSession(user:int) -> dict:
    try:
        sql = "SELECT * FROM temp_sessions WHERE user_id = %s"
        params = (user,)
        session = selectData(sql, params)
        if session is None:
            return {}
        return session
    except Exception as err:
        return {"Error": f"Error al obtener sesión temporal: {err}"}

def addTempSession(user:int, token:str, expire:float) -> dict:
    try:
        sql = "INSERT INTO temp_sessions (user_id, session_token, expiration) VALUES (%s, %s, %s)"
        params = (user, token, expire)
        result = insertData(sql, params)
        if result is not None:
            return result
        return {"Error": "No se pudo agregar la sesión temporal"}
    except Exception as err:
        return {"Error": f"Error al agregar sesión temporal: {err}"}

def removeTempSession(user:int) -> bool|dict:
    try:
        sql = "DELETE FROM temp_sessions WHERE user_id = %s"
        params = (user,)
        deleteData(sql, params)
        return True
    except Exception as err:
        return {"Error":"Error al eliminar sesión temporal: {err}"}

def getByToken(token:str) -> dict:
    try:
        sql = "SELECT * FROM temp_sessions WHERE session_token = %s"
        params = (token,)
        session = selectData(sql, params)
        if session is None:
            return {}   
        return session
    except Exception as err:
        return {"Error": f"Error al obtener sesión temporal: {err}"}