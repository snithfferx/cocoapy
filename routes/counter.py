from flask import Blueprint
from modules.colonies.coloniesController import countColoniesByQuarters
from flask_jwt_extended import jwt_required
from flask_cors import cross_origin
from flask import current_app
from middlewares.req_res import get_json, success, bad_request

counterBp = Blueprint('counter', __name__, url_prefix="/counter")

def origin():
    # Lee el origen permitido desde la config de la app
    return current_app.config.get("ALLOWED_ORIGIN", "*")

@counterBp.route('/get-colonies', methods=['POST'])
@jwt_required()
@cross_origin(origins=lambda: origin(), supports_credentials=True)
def getColonies():
    try:
        data = get_json()
        file = data.get("file")
        user = data.get("user")
        description = data.get("description")
        sensibility = data.get("sensitivity", type=int, default=50)
        quarters = data.get("quarters",type=int,default=2)
        name = data.get("name",type=str,default='example_')
        if not file:
            return bad_request("Archivo no recibido")
        if file:
            contenido = file.read()
            result = countColoniesByQuarters(user,name,description,BytesIO(contenido), sensibility=sensibility,cuadrantes=(quarters,quarters))
            """ {media, img_base64, colonias_totales, colonias_imagenes} """
            return success({
                    'avg': result['media'],
                    'ovi':result['img_base64'],
                    'totals':{
                        'quarters': [f"Cuadrante {i+1}" for i in range(len(result['colonias_totales']))],
                        'values': result['colonias_totales'],
                        'images': result['colonias_imagenes']
                    },
                    'name': name
                }, 200)
    except Exception as e:
        return bad_request(str(e))
