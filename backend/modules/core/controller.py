def response(message: str, data: dict | list | None = None, code: int = 200) -> dict[str, str | int | dict | list]:
    if (code >= 400):
        return {"status": "error", "message": message, "data": data, "code": code}
    return {"status": "success", "message": message, "data": data, "code": code}