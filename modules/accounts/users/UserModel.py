from modules.core.connection import get_db_connection

def addUser(user_data: dict) -> str:
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
                       (user_data['username'], user_data['email'], user_data['password']))
        connection.commit()
        return "User added successfully"
    except connection.Error as err:
        return f"Error adding user: {err}"
    finally:
        cursor.close()
        connection.close()

def getUser(user_id: int) -> dict:
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    connection.close()
    return user if user else {}

def updateUser(user_id: int, user_data: dict) -> str:
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("UPDATE users SET username = %s, email = %s, password = %s WHERE user_id = %s",
                       (user_data['username'], user_data['email'], user_data['password'], user_id))
        connection.commit()
        return "User updated successfully"
    except connection.Error as err:
        return f"Error updating user: {err}"
    finally:
        cursor.close()
        connection.close()

def deleteUser(user_id: int) -> str:
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("DELETE FROM users WHERE user_id = %s", (user_id,))
        connection.commit()
        return "User deleted successfully"
    except connection.Error as err:
        return f"Error deleting user: {err}"
    finally:
        cursor.close()
        connection.close()

def getAllUsers() -> list:
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    cursor.close()
    connection.close()
    return users if users else []

def getUserByName(username: str) -> dict:
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()
    connection.close()
    return user if user else {}

def getUserByEmail(email: str) -> dict:
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    connection.close()
    return user if user else {}