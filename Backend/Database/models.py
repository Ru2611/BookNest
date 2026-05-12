from sqlalchemy import Column, Integer, String, Float

try:
    from Backend.Database.database import Base
except ModuleNotFoundError:
    from Backend.Database.database import Base


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    price = Column(Float, default=0)
    description = Column(String, default="")
    image = Column(String, default="")
    genre = Column(String, default="")
    type = Column(String, default="sell")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
