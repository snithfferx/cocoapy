from UserModel import addUser, getUser, updateUser, deleteUser,getAllUsers,getUserByName,getUserByEmail


def create(user_data: dict) -> dict:
    result = addUser(user_data)
    if "Error" in result:
        return {"error": result}
    return {"message": "User created successfully"}

def read(user_id: int) -> dict:
    user = getUser(user_id)
    if not user:
        return {"error": "User not found"}
    return user

def readAll() -> list:
    users = getAllUsers()
    if not users:
        return {"error": "No users found"}
    return users

def readByName(username: str) -> dict:
    user = getUserByName(username)
    if not user:
        return {"error": "User not found"}
    return user

def readByEmail(email: str) -> dict:
    user = getUserByEmail(email)
    if not user:
        return {"error": "User not found"}
    return user

def update(user_id: int, user_data: dict) -> dict:
    result = updateUser(user_id, user_data)
    if "Error" in result:
        return {"error": result}
    return {"message": "User updated successfully"}

def delete(user_id: int) -> dict:
    result = deleteUser(user_id)
    if "Error" in result:
        return {"error": result}
    return {"message": "User deleted successfully"}

def exist(username: str, email: str) -> bool:
    user = getUserByName(username) if username else getUserByEmail(email)
    return user is not None