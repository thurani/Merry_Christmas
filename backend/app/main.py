from fastapi import FastAPI
from routes.wish_routes import router as wish_router

app = FastAPI(debug=True)

app.include_router(wish_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Christmas Wishes API!"}