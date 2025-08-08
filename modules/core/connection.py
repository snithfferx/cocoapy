import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

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
