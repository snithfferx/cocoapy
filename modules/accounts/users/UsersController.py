from modules.accounts.users.UserModel import addUser, getUser, updateUser, deleteUser,getAllUsers,getUserByName,getUserByEmail
from modules.core.controller import response

ALLOWED_ROLES = {"admin", "user"}

def create(userData: dict) -> dict:
    if not userData["username"] or not userData["email"] or not userData["password"]:
        return response( "Faltan campos", None, 400)
    try :
        result = addUser(userData)
        if result["status"] == "error":
            return response( result["message"], None, result["code"])
        return response("User created successfully", result, 200)
    except Exception as err:
        return response( str(err), None, 500)

def read(user_id: int) -> dict:
    user = getUser(user_id)
    if not user:
        return response("User not found", None, 404)
    return user

def readAll() -> list[dict[str, str|int]] | dict[str, str]:
    users = getAllUsers()
    if not users:
        return response("No users found", None, 404)
    return users

def readByName(username: str) -> dict | None:
    return getUserByName(username) or None

def readByEmail(email: str) -> dict | None:
    return getUserByEmail(email) or None

def update(user_id: int, user_data: dict) -> dict[str, str]:
    result = updateUser(user_id, user_data)
    if "Error" in result:
        return response( result, None, 500)
    return response("User updated successfully", None, 200)

def delete(user_id: int) -> dict[str, str]:
    result = deleteUser(user_id)
    if "Error" in result:
        return response( result, None, 500)
    return response("User deleted successfully", None, 200)

def exist(username: str, email: str) -> bool:
    if username:
        return getUserByName(username) is not None
    elif email:
        return getUserByEmail(email) is not None
    else:
        return False
