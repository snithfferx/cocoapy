from modules.core.connection import get_db_connection
connection = get_db_connection()
cursor = connection.cursor(dictionary=True)

def exists(user:int) -> bool:
    cursor.execute("SELECT COUNT(*) FROM sessions WHERE user_id = %s", (user,))
    xsts = cursor.fetchone()
    closeConnection()
    if xsts is None:
        return False
    else:
        if len(xsts) > 0:
            return True
    return False

def getOne(user:int) -> dict:
    try:
        cursor.execute("SELECT * FROM users WHERE user_id = %s", (user,))
        session = cursor.fetchone()
        if session is None:
            return {}
        return session
    except connection.Error as err:
        return {"Error": f"Error al obtener sesión: {err}"}
    finally:
        closeConnection()

def add(user:int, token:str, expire:float) -> dict:
    if exists(user):
        cursor.execute("DELETE FROM sessions WHERE user_id = %s", (user,))
        connection.commit()
    try:
        cursor.execute("INSERT INTO users (user_id, session_token, expiration) VALUES (%s, %s, %s)",
                       (user, token, expire))
        result = cursor.fetchone()
        connection.commit()
        if result is None:
            return {"Error": "No se pudo agregar la sesión"}
        return result
    except connection.Error as err:
        return {"Error": f"Error al agregar sesión: {err}"}
    finally:
        closeConnection()

def edit (user:int, token:str, expire:float) -> dict[str,str]:
    try:
        cursor.execute("UPDATE users SET session_token = %s, expiration = %s WHERE user_id = %s",
                       (token, expire, user))
        connection.commit()
        return {"message": f"Sesión actualizada para el usuario {user}"}
    except connection.Error as err:
        return {"Error": f"Error al actualizar sesión: {err}"}
    finally:
        closeConnection()

def remove(user:int) -> bool|dict[str,str]:
    try:
        cursor.execute("DELETE FROM sessions WHERE user_id = %s", (user,))
        connection.commit()
        return True
    except connection.Error as err:
        return {"Error":"Error al eliminar sesión: {err}"}
    finally:
        closeConnection()

def getTempSession(user:int) -> dict:
    try:
        cursor.execute("SELECT * FROM temp_sessions WHERE user_id = %s", (user,))
        session = cursor.fetchone()
        if session is None:
            return {}
        return session
    except connection.Error as err:
        return {"Error": f"Error al obtener sesión temporal: {err}"}
    finally:
        closeConnection()

def addTempSession(user:int, token:str, expire:float) -> dict:
    try:
        cursor.execute("INSERT INTO temp_sessions (user_id, session_token, expiration) VALUES (%s, %s, %s)",
                       (user, token, expire))
        result = cursor.fetchone()
        connection.commit()
        if result is not None:
            return result
        return {"Error": "No se pudo agregar la sesión temporal"}
    except connection.Error as err:
        return {"Error": f"Error al agregar sesión temporal: {err}"}
    finally:
        closeConnection()

def removeTempSession(user:int) -> bool|dict:
    try:
        cursor.execute("DELETE FROM temp_sessions WHERE user_id = %s", (user,))
        connection.commit()
        return True
    except connection.Error as err:
        return {"Error":"Error al eliminar sesión temporal: {err}"}
    finally:
        closeConnection()

def closeConnection():
    if cursor:
        cursor.close()
    if connection:
        connection.close()
    return True