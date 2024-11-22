from pydantic import BaseModel

class Wish(BaseModel):
    name: str
    email: str
    description: str