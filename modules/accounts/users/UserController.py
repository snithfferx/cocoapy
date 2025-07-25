from UserModel import add_user, get_user, update_user, delete_user

def create(user_data: dict) -> dict:
    result = add_user(user_data)
    if "Error" in result:
        return {"error": result}
    return {"message": "User created successfully"}

def read(user_id: int) -> dict:
    user = get_user(user_id)
    if not user:
        return {"error": "User not found"}
    return user

def update(user_id: int, user_data: dict) -> dict:
    result = update_user(user_id, user_data)
    if "Error" in result:
        return {"error": result}
    return {"message": "User updated successfully"}

def delete(user_id: int) -> dict:
    result = delete_user(user_id)
    if "Error" in result:
        return {"error": result}
    return {"message": "User deleted successfully"}