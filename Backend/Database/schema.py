from typing import Optional

from pydantic import BaseModel

try:
    # Pydantic v2
    from pydantic import ConfigDict  # type: ignore
except Exception:  # pragma: no cover
    ConfigDict = None  # type: ignore


class BookCreate(BaseModel):
    title: str
    author: str
    price: float
    description: str
    image: str
    genre: str
    type: str
    condition: Optional[str] = ""
    seller_name: Optional[str] = ""
    seller_city: Optional[str] = ""


class BookOut(BaseModel):
    id: int
    title: str
    author: str
    price: float
    description: str
    image: str
    genre: str
    type: str
    condition: str = ""
    seller_name: str = ""
    seller_city: str = ""
    avg_rating: float = 0.0
    rating_count: int = 0

    if ConfigDict is not None:  # Pydantic v2
        model_config = ConfigDict(from_attributes=True)
    else:  # Pydantic v1
        class Config:
            orm_mode = True


class UserCreate(BaseModel):
    name: str
    phone: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str
