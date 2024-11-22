from fastapi import APIRouter, HTTPException
from models.wish import Wish
from db.database import get_db_connection
from mysql.connector.errors import Error

router = APIRouter()

@router.api_route("/{action}/", methods=["GET", "POST"])
async def handle_wishes(action: str, wish: Wish = None):
    conn = await get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)

        if action == "get":
            cursor.execute("SELECT name, email, description FROM wishes")
            records = cursor.fetchall()
            return records

        elif action == "add":
            if not wish:
                raise HTTPException(status_code=400, detail="Wish data is required")
            sql = "INSERT INTO wishes (name, email, descrisption) VALUES (%s, %s, %s)"
            cursor.execute(sql, (wish.name, wish.email, wish.description))
            conn.commit()
            return {"message": "Wish added successfully!", "id": cursor.lastrowid}

        else:
            raise HTTPException(status_code=404, detail="Action not supported")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {str(e)}")
    finally:
        cursor.close()
        conn.close()