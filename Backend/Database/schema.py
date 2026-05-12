from pydantic import BaseModel

class BookCreate(BaseModel):
    title: str
    author: str
    price: float
    description: str
    image: str
    genre: str
    type: str


class UserCreate(BaseModel):
    name: str
    phone: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str
