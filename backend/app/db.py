import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def get_master_conn():
    return psycopg2.connect(
        host=os.getenv("DB_HOST_MASTER"),
        port=os.getenv("DB_PORT_MASTER"),
        database=os.getenv("DB_NAME_MASTER"),
        user=os.getenv("DB_USER_MASTER"),
        password=os.getenv("DB_PASSWORD_MASTER")
    )

def get_slave_conn():
    return psycopg2.connect(
        host=os.getenv("DB_HOST_SLAVE"),
        port=os.getenv("DB_PORT_SLAVE"),
        database=os.getenv("DB_NAME_SLAVE"),
        user=os.getenv("DB_USER_SLAVE"),
        password=os.getenv("DB_PASSWORD_SLAVE")
    )
