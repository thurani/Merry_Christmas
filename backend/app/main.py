from fastapi import FastAPI, HTTPException, Depends, Form
from pydantic import BaseModel
import mysql.connector
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(debug=True)

def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host = "localhost",
            user = "root",
            passwd = "root",
            database = "christmas"
        )
        return conn
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

class CreateWish(BaseModel):
    name: str
    email: str
    description: str

@app.get("/get_wishes/")
def get_wishes():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary = True)
        cursor.execute("select name, email, description from wishes")
        records = cursor.fetchall()
        return records
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close() 

@app.post("/add_wishes/")
def add_wishes(wish: CreateWish):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary = True)
        sql = "insert into wishes (name, email, description) values (%s, %s, %s)"
        val = (wish.name, wish.email, wish.description)
        cursor.execute(sql, val)
        conn.commit()
        return {"message": "Wish added successfully!", "id": cursor.lastrowid}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
