from flask import Blueprint, request, jsonify
from modules.colonies.coloniesController import contar_colonias_por_cuadrante
from flask_jwt_extended import jwt_required

counterBp = Blueprint('counter', __name__)

counterBp.route('/contar', methods=['POST'])
@jwt_required()
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
