from io import BytesIO
import os
from dotenv import load_dotenv
load_dotenv()
# Flask importados
from flask import Flask, g, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
# Modules importados
from modules.colonies.colony_counter import contar_colonias_por_cuadrante
from modules.accounts.auth.AuthController import userRegistration, userLogin, read

app = Flask(__name__, static_folder='static')

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")  # Agrega esto a tu .env
jwt = JWTManager(app)

CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

# Servir archivos estáticos como en FastAPI
@app.route("/", defaults={"path": "index.html"})

@app.route("/contar", methods=["POST"])
def contar():
    try:
        file = request.files.get("file")
        sensibility = request.form.get("sensitivity", type=int, default=50)
        quarters = request.form.get("quarters",type=int,default=2)
        name = request.form.get("name",type=str,default='example_')
        if not file:
            return jsonify({
                'status': 'error',
                'message': "Archivo no recibido"}), 400
        if file:
            contenido = file.read()
            avg, ovi, totals, cuts = contar_colonias_por_cuadrante(BytesIO(contenido), sensibilidad=sensibility,cuadrantes=(quarters,quarters))
            return jsonify({
                'status': 'ok',
                'data': {
                    'avg': avg,
                    'ovi':ovi,
                    'totals':{
                        'quarters': [f"Cuadrante {i+1}" for i in range(len(totals))],
                        'values': totals,
                        'images': cuts
                    },
                    'name': name
                }
            })
        return jsonify({
            'status': 'error',
            'message': "Archivo no recibido"}), 400
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    user = userRegistration(username, email, password)
    if "error" in user:
        return jsonify({"error": user["error"]}), 400
    else:
        return jsonify(user), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")
    if username and not email:
        user = userLogin(username, None, password)
    if email and not username:
        user = userLogin(None, email, password)
    if not user:
        return jsonify({"error": "Credenciales inválidas"}), 401
    if "error" in user:
        return jsonify({"error": user["error"]}), 401
    return jsonify(user), 200

@app.route("/perfil", methods=["GET"])
@jwt_required()
def perfil():
    user_id = get_jwt_identity()
    userData = read(user_id)
    if not userData:
        return jsonify({"error": "Usuario no encontrado"}), 404
    return jsonify({"message": f"Bienvenido usuario {user_id}","data": userData}), 200

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(app.static_folder, path)

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