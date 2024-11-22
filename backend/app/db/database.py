from mysql.connector import pooling
from config.config import settings

dbconfig = {
    "host": settings.db_host,
    "user": settings.db_user,
    "password": settings.db_password,
    "database": settings.db_name
}

db_pool = pooling.MySQLConnectionPool(pool_name="mypool", pool_size=5, **dbconfig)

async def get_db_connection():
    try:
        conn = db_pool.get_connection()
        return conn
    except Exception as e:
        raise Exception(f"Database connection error: {str(e)}")