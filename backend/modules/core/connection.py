import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

connection = None
cursor = None

def get_db_connection():
    try:
        return mysql.connector.connect(
            host=os.getenv("MYSQL_DB_HOST"),
            port=os.getenv("MYSQL_DB_PORT"),
            user=os.getenv("MYSQL_DB_USER"),
            password=os.getenv("MYSQL_DB_PASS"),
            database=os.getenv("MYSQL_DB_NAME")
        )
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return err
    # except Exception as err:
    #     print(f"Error: {err}")
    #     return err
    # finally:
    #     return None
    
def openConnection():
    global connection
    connection = get_db_connection()
    if isinstance(connection, Exception):
        raise Exception(f"Database connection failed: {connection}")
    return connection.cursor(dictionary=True)

def closeConnection():
    global cursor, connection
    if cursor:
        cursor.close()
    if connection:
        connection.close()
    return True

def insertData(sql, params):
    cursor = openConnection()
    cursor.execute(sql, params)
    connection.commit()
    closeConnection()
    return cursor.lastrowid

def updateData(sql, params):
    cursor = openConnection()
    cursor.execute(sql, params)
    connection.commit()
    closeConnection()
    return cursor.rowcount

def deleteData(sql, params):
    cursor = openConnection()
    cursor.execute(sql, params)
    connection.commit()
    closeConnection()
    return cursor.rowcount

def selectData(sql, params=None):
    cursor = openConnection()
    if params is None:
        cursor.execute(sql)
    else:
        cursor.execute(sql, params)
    result = cursor.fetchall()
    closeConnection()
    return result