# from fastapi import FastAPI, File, UploadFile,Form
# from fastapi.responses import JSONResponse
# from colony_counter import contar_colonias_por_cuadrante
# from fastapi.staticfiles import StaticFiles
# from io import BytesIO

# app = FastAPI()

# @app.post("/contar")
# async def contar(file: UploadFile = File(...),sensibilidad: int = Form(50)):
#     contenido = await file.read()
#     # total, _ = contar_colonias(BytesIO(contenido))
#     total, imagen_base64,totales, cortes = contar_colonias_por_cuadrante(BytesIO(contenido),sensibilidad=sensibilidad)
#     return JSONResponse({
#         "colonias_detectadas": total,
#         "imagen_procesada": imagen_base64,
#         "colonias_por_cuadrante": totales,
#         "cortes_por_cuadrante": cortes
#     })
# app.mount("/", StaticFiles(directory="static", html=True), name="static")

from flask import Flask, request, jsonify, send_from_directory
from colony_counter import contar_colonias_por_cuadrante
from io import BytesIO
import os

app = Flask(__name__, static_folder='static')

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

# Servir archivos estáticos como en FastAPI
@app.route("/", defaults={"path": "index.html"})
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