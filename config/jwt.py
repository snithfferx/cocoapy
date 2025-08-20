from datetime import timedelta
import os
def init_jwt(app):
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "cámbiame_por_env")  # usa variables de entorno
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=4)
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    app.config["JWT_HEADER_NAME"] = "Authorization"
    app.config["JWT_HEADER_TYPE"] = "Bearer"