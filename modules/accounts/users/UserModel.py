from modules.core.connection import get_db_connection

def add_user(user_data: dict) -> str:
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

def get_user(user_id: int) -> dict:
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    connection.close()
    return user if user else {}

def update_user(user_id: int, user_data: dict) -> str:
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

def delete_user(user_id: int) -> str:
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