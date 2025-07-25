from SessionModel import get_session, add_session, session_exists

def get_user_session(user_id: int) -> dict:
    session = get_session(user_id)
    if not session:
        return {"error": "No session found for user"}
    return session

def create_user_session(user_id: int, token: str, expire: int) -> dict:
    result = add_session(user_id, token, expire)
    if "Error" in result:
        return {"error": result}
    return {"message": f"Session created for user {user_id}"}

def validate_user_session(user_id: int) -> bool:
    return session_exists(user_id)