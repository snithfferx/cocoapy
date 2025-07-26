from io import BytesIO
import os
from dotenv import load_dotenv
load_dotenv()
# Flask importados
from flask import Flask, g, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
# Importar rutas
from routes.auth import authBp
from routes.user import userBp
from routes.counter import counterBp


app = Flask(__name__, static_folder='static')

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")  # Agrega esto a tu .env
jwt = JWTManager(app)

CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

# Servir archivos estáticos como en FastAPI
# @app.route("/", defaults={"path": "index.html"})

# @app.route("/contar", methods=["POST"])

# @app.route("/<path:path>")
# def static_files(path):
#     return send_from_directory(app.static_folder, path)

app.register_blueprint(authBp)
app.register_blueprint(userBp)
app.register_blueprint(counterBp)


if __name__ == "__main__":
    # try:
    #     # Usar puerto 8000 que suele tener menos restricciones
    #     print("Iniciando servidor en http://localhost:8000")
        app.run(host='localhost', port=8000, debug=False)
    # except Exception as e:
    #     print(f"Error al iniciar el servidor: {e}")
    #     # Intentar con 0.0.0.0 que permite conexiones desde cualquier interfaz
    #     try:
    #         print("Intentando iniciar en 0.0.0.0:8000")
    #         app.run(host='0.0.0.0', port=8000, debug=False)
    #     except Exception as e:
    #         print(f"Error al iniciar el servidor en configuración alternativa: {e}")
    # app.run()