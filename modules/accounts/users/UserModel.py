from modules.core.connection import get_db_connection

connection = None
cursor = None

def addUser(userData: dict) -> dict:
    global connection, cursor
    cursor = openConnection()
    try:
        result = cursor.execute("INSERT INTO users (user_name, email, password) VALUES (%s, %s, %s)",
                       (userData['username'], userData['email'], userData['password']))
        connection.commit()
        closeConnection()
        return {"status": "success", "message": "User added successfully", "data": result, "code": 201}
    except Exception as err:
        return {"status": "error", "message": str(err), "code": 500}

def getUser(user_id: int) -> dict | None:
    global connection, cursor
    cursor = openConnection()
    cursor.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
    user = cursor.fetchone()
    closeConnection()
    return user if user else None

def updateUser(user_id: int, user_data: dict) -> str:
    global connection, cursor
    cursor = openConnection()
    try:
        cursor.execute("UPDATE users SET user_name = %s, email = %s, password = %s WHERE user_id = %s",
                       (user_data['username'], user_data['email'], user_data['password'], user_id))
        connection.commit()
        closeConnection()
        return "User updated successfully"
    except connection.Error as err:
        return f"Error updating user: {err}"

def deleteUser(user_id: int) -> str:
    global connection, cursor
    cursor = openConnection()
    try:
        cursor.execute("DELETE FROM users WHERE user_id = %s", (user_id,))
        connection.commit()
        closeConnection()
        return "User deleted successfully"
    except connection.Error as err:
        return f"Error deleting user: {err}"

def getAllUsers() -> list:
    global connection, cursor
    cursor = openConnection()
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    closeConnection()
    return users if users else []

def getUserByName(username: str) -> dict|None:
    global connection, cursor
    cursor = openConnection()
    cursor.execute("SELECT * FROM users WHERE user_name = %s", (username,))
    user = cursor.fetchone()
    closeConnection()
    return user if user else None

def getUserByEmail(email: str) -> dict:
    global connection, cursor
    cursor = openConnection()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    closeConnection()
    return user if user else None

def openConnection():
    global connection
    connection = get_db_connection()
    if isinstance(connection, Exception):
        raise Exception(f"Database connection failed: {connection}")
    return connection.cursor(dictionary=True)

def closeConnection():
    global cursor, connection
    if cursor:
        cursor.close()
    if connection:
        connection.close()
    return True