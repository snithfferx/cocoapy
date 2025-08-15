from modules.logs.LogModel import *
def savelog(user_id, action):
    try:
        return add(user_id, action)
    except Exception as err:
        return {"Error":"Error al guardar log: {err}"}

def getLogs():
    try:
        return getAll()
    except Exception as err:
        return {"Error":"Error al obtener logs: {err}"}

def getLog(id):
    try:
        return getOne(id)
    except Exception as err:
        return {"Error":"Error al obtener log: {err}"}
    
def updateLog(id, user_id, action):
    try:
        return update(id, user_id, action)
    except Exception as err:
        return {"Error":"Error al actualizar log: {err}"}
    
def deleteLog(id):
    try:
        return delete(id)
    except Exception as err:
        return {"Error":"Error al eliminar log: {err}"}