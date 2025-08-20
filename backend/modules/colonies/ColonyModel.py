from json import JSONEncoder
from modules.core.connection import insertData

def saveResults(user_id,title,description,sectors,sensitivity,media, max,min, sum, colonias_totales):
    totalPerSector = JSONEncoder().encode(colonias_totales)
    sql = "INSERT INTO test_examples (user_id, title, description, sectors, sensitivity, total_colonies, avg_colonies, max_colonies, min_colonies, total_per_sector) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    params = (user_id, title, description, sectors, sensitivity, sum,media,max,min, totalPerSector)
    insertData(sql, params)
    return True