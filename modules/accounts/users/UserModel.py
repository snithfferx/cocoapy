from modules.core.connection import insertData, selectData, updateData, deleteData
from modules.models.mappers import db_user_to_domain

def addUser(userData: dict) -> dict:
    try:
        sql = "INSERT INTO users (user_name, email, password, role) VALUES (%s, %s, %s, %s)"
        params = (userData['username'], userData['email'], userData['password'], userData['role'])
        user_id = insertData(sql, params)
        return {
            "status": "success",
            "message": "User added successfully",
            "data": {"id": user_id, "username": userData["username"], "email": userData["email"], "role": userData["role"]},
            "code": 201
        }
    except Exception as err:
        # Manejo fino de duplicados (MySQL 1062)
        msg = str(err)
        if "1062" in msg:
            if "user_name" in msg:
                return {"status": "error", "message": "Nombre de usuario ya existe", "code": 409}
            if "email" in msg:
                return {"status": "error", "message": "Email ya existe", "code": 409}
        return {"status": "error", "message": msg, "code": 500}

def getUser(user_id: int) -> dict | None:
    try:
        sql = "SELECT * FROM users WHERE user_id = %s"
        params = (user_id,)
        user = selectData(sql, params)
        return db_user_to_domain(user) if user else None
    except Exception as err:
        return {"status": "error", "message": str(err), "code": 500}

def updateUser(user_id: int, user_data: dict) -> str:
    try:
        sql = "UPDATE users SET user_name = %s, email = %s, password = %s WHERE user_id = %s"
        params = (user_data['username'], user_data['email'], user_data['password'], user_id)
        updateData(sql, params)
        return "User updated successfully"
    except Exception as err:
        return f"Error updating user: {err}"

def deleteUser(user_id: int) -> str:
    try:
        sql = "DELETE FROM users WHERE user_id = %s"
        params = (user_id,)
        deleteData(sql, params)
        return "User deleted successfully"
    except Exception as err:
        return f"Error deleting user: {err}"

def getAllUsers() -> list:
    try:
        sql = "SELECT * FROM users"
        users = selectData(sql)
        return [db_user_to_domain(user) for user in users] if users else []
    except Exception as err:
        return {"status": "error", "message": str(err), "code": 500}

def getUserByName(username: str) -> dict|None:
    try:
        sql = "SELECT * FROM users WHERE user_name = %s"
        params = (username,)
        user = selectData(sql, params)
        return db_user_to_domain(user) if user else None
    except Exception as err:
        return {"status": "error", "message": str(err), "code": 500}

def getUserByEmail(email: str) -> dict:
    try:
        sql = "SELECT * FROM users WHERE email = %s"
        params = (email,)
        user = selectData(sql, params)
        return db_user_to_domain(user) if user else None
    except Exception as err:
        return {"status": "error", "message": str(err), "code": 500}