from flask import Flask, g, request, jsonify, send_from_directory
from colony_counter import contar_colonias_por_cuadrante
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware
from werkzeug.security import generate_password_hash,check_password_hash
from connection import get_db_connection

connection = get_db_connection()

app = Flask(__name__, static_folder='static')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir archivos estáticos como en FastAPI
@app.route("/", defaults={"path": "index.html"})

@app.route("/contar", methods=["POST"])
def contar():
    try:
        file = request.files.get("file")
        sensibility = request.form.get("sensitivity", type=int, default=50)
        quarters = request.form.get("quarters",type=int,default=2)
        name = request.form.get("name",type=str,default='example_')


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

    if not username or not email or not password:
        return jsonify({"error": "Faltan campos"}), 400

    hashed_pw = generate_password_hash(password)

    cursor = connection.cursor()

    try:
        cursor.execute("""
            INSERT INTO usuarios (nombre_usuario, correo, contraseña_hash)
            VALUES (%s, %s, %s)
        """, (username, email, hashed_pw))
        connection.commit()
        return jsonify({"message": "Usuario registrado exitosamente"}), 201
    except connection.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM usuarios WHERE nombre_usuario = %s", (username,))
    user = cursor.fetchone()

    cursor.close()
    connection.close()

    if user and check_password_hash(user["contraseña_hash"], password):
        return jsonify({"message": "Login exitoso", "user": user["nombre_usuario"]}), 200
    else:
        return jsonify({"error": "Credenciales inválidas"}), 401

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