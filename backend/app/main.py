from fastapi import FastAPI, Request
from app.db import get_master_conn, get_slave_conn

app = FastAPI()

@app.get("/")
def home():
    return "Welcome to the Project"

