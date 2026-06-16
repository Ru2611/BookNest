from sqlalchemy import Column, Integer, String, Float

from .database import Base


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
    condition = Column(String, default="")
    seller_name = Column(String, default="")
    seller_city = Column(String, default="")
    # Rating stored as an accumulated sum and count so we can compute average safely
    rating_sum = Column(Float, default=0.0)
    rating_count = Column(Integer, default=0)

    @property
    def average_rating(self) -> float:
        try:
            return float(self.rating_sum) / (int(self.rating_count) or 1) if self.rating_count else 0.0
        except Exception:
            return 0.0

    @property
    def avg_rating(self) -> float:
        return self.average_rating


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
