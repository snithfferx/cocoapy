def db_user_to_domain(row: dict) -> dict:
    # row viene con claves de DB: user_name, email, password, role, id
    return {
        "id": row["id"],
        "username": row["user_name"],
        "email": row["email"],
        "password": row["password"],
        "role": row["role"],
    }