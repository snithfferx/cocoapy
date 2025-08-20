from modules.core.connection import insertData, selectData

def addLog(user_id, action):
    try:
        sql = "INSERT INTO logs (user_id, action) VALUES (%s, %s)"
        params = (user_id, action)
        insertData(sql, params)
        return True
    except Exception as err:
        return {"Error": f"Error al agregar log: {err}"}

def getLogs():
    try:
        return selectData("SELECT * FROM logs")
    except Exception as err:
        return {"Error": f"Error al obtener logs: {err}"}

def getLog(id):
    try:
        return selectData("SELECT * FROM logs WHERE id = %s", (id,))
    except Exception as err:
        return {"Error": f"Error al obtener log: {err}"}

def updateLog(id, user_id, action):
    try:
        sql = "UPDATE logs SET user_id = %s, action = %s WHERE id = %s"
        params = (user_id, action, id)
        updateData(sql, params)
        return True
    except Exception as err:
        return {"Error": f"Error al actualizar log: {err}"}

def deleteLog(id):
    try:
        sql = "DELETE FROM logs WHERE id = %s"
        params = (id,)
        deleteData(sql, params)
        return True
    except Exception as err:
        return {"Error": f"Error al eliminar log: {err}"}

