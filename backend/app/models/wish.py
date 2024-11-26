from pydantic import BaseModel

class Wish(BaseModel):
    id: int
    name: str
    email: str
    description: str