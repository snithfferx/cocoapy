from modules.core.connection import get_db_connection

def exists(user:int) -> bool:
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM sessions WHERE user_id = %s", (user,))
    exists = cursor.fetchone()[0] > 0
    cursor.close()
    connection.close()
    return exists

def getOne(user:int) -> dict:
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE user_id = %s", (user,))
    session = cursor.fetchone()
    cursor.close()
    connection.close()
    return session if session else {}

def add(user:int, token:str, expire:float) -> dict[str,str|int|float]|None:
    connection = get_db_connection()
    cursor = connection.cursor()
    if exists(user):
        cursor.execute("DELETE FROM sessions WHERE user_id = %s", (user,))
        connection.commit()
    try:
        cursor.execute("INSERT INTO users (user_id, session_token, expiration) VALUES (%s, %s, %s)",
                       (user, token, expire))
        result = cursor.fetchone()
        connection.commit()
        return result if result else None
    except connection.Error as err:
        return {"Error": f"Error al agregar sesión: {err}"}
    finally:
        cursor.close()
        connection.close()

def edit (user:int, token:str, expire:float) -> dict[str,str]:
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("UPDATE users SET session_token = %s, expiration = %s WHERE user_id = %s",
                       (token, expire, user))
        connection.commit()
        return {"message": f"Sesión actualizada para el usuario {user}"}
    except connection.Error as err:
        return {"Error": f"Error al actualizar sesión: {err}"}
    finally:
        cursor.close()
        connection.close()

def remove(user:int) -> bool|dict[str,str]:
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("DELETE FROM users WHERE user_id = %s", (user,))
        connection.commit()
        return True
    except connection.Error as err:
        return {"Error":"Error al eliminar sesión: {err}"}
    finally:
        cursor.close()
        connection.close()