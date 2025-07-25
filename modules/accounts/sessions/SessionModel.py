from modules.core.connection import get_db_connection

def session_exists(user:int) -> bool:
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM sessions WHERE user_id = %s", (user,))
    exists = cursor.fetchone()[0] > 0
    cursor.close()
    connection.close()
    return exists

def get_session(user:int) -> dict:
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE user_id = %s", (user,))
    session = cursor.fetchone()
    cursor.close()
    connection.close()
    return session if session else {}

def add_session(user:int, token:str, expire:int) -> str:
    connection = get_db_connection()
    cursor = connection.cursor()
    if session_exists(user):
        cursor.execute("DELETE FROM sessions WHERE user_id = %s", (user,))
        connection.commit()
    try:
        cursor.execute("INSERT INTO users (user_id, session_token, expiration) VALUES (%s, %s, %s)",
                       (user, token, expire))
        connection.commit()
        return "Sesión agregada para el usuario {user}"
    except connection.Error as err:
        return "Error al agregar sesión: {err}"
    finally:
        cursor.close()
        connection.close()