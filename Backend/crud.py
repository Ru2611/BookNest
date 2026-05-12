from sqlalchemy.orm import Session

from Backend.Database import models
try:
    from Backend.Database import schema
except ModuleNotFoundError:
    import Backend.Database.models as models, Backend.Database.schema as schema

def create_book(db: Session, book: schema.BookCreate):
    db_book = models.Book(**book.dict())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


def get_books(db: Session):
    return db.query(models.Book).all()


def get_book(db: Session, book_id: int):
    return db.query(models.Book).filter(models.Book.id == book_id).first()
