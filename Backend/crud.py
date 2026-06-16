from sqlalchemy.orm import Session

from Database import models, schema


def create_book(db: Session, book: schema.BookCreate):
    payload = book.model_dump() if hasattr(book, "model_dump") else book.dict()
    db_book = models.Book(**payload)
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


def get_books(db: Session):
    return db.query(models.Book).all()


def get_book(db: Session, book_id: int):
    return db.query(models.Book).filter(models.Book.id == book_id).first()
