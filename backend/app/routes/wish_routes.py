from fastapi import APIRouter, HTTPException
from models.wish import Wish
from db.database import get_db_connection

router = APIRouter()

@router.api_route("/{action}/", methods=["GET", "POST", "DELETE"])
async def handle_wishes(action: str, wish: Wish = None, wish_id: int = None):
    conn = await get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)

        if action == "get":
            cursor.execute("SELECT id, name, email, description FROM wishes")
            records = cursor.fetchall()
            return records

        elif action == "add":
            if not wish:
                raise HTTPException(status_code=400, detail="Wish data is required")
            sql = "INSERT INTO wishes (name, email, description) VALUES (%s, %s, %s)"
            cursor.execute(sql, (wish.name, wish.email, wish.description))
            conn.commit()
            return {"message": "Wish added successfully!", "id": cursor.lastrowid}

        elif action == "delete":
            if not wish_id:
                raise HTTPException(status_code=400, detail="Wish ID is required")
            sql = "DELETE FROM wishes WHERE id = %s"
            cursor.execute(sql, (wish_id,))
            conn.commit()
            return {"message": "Wish deleted successfully!"}

        else:
            raise HTTPException(status_code=404, detail="Action not supported")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {str(e)}")
    finally:
        cursor.close()
        conn.close()