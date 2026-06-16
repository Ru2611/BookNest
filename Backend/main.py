from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import crud
from Database import models, schema
from Database.bootstrap import ensure_books_schema, seed_books_if_empty
from Database.database import SessionLocal, engine
from Route.router import router

app = FastAPI()

models.Base.metadata.create_all(bind=engine)
ensure_books_schema(engine)
seed_books_if_empty(engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app.include_router(router)


# @app.get("/health")
# def health():
#     return {"status": "ok"}


# @app.post("/books", response_model=schema.BookOut)
# def create(book: schema.BookCreate, db: Session = Depends(get_db)):
#     return crud.create_book(db, book)

@app.post("/books", response_model=schema.BookOut)
def create(book:schema.BookCreate,db:Session = Depends(get_db)):
    return crud.create_book(db,book)



# @app.get("/books", response_model=list[schema.BookOut])
# def read_books(db: Session = Depends(get_db)):
#     return crud.get_books(db)

@app.get("/books",response_model=list[schema.BookOut])
def read_books(db:Session=Depends(get_db)):
    return crud.get_books(db)

@app.get("/books/{id}", response_model=schema.BookOut | None)
def read_book(id: int, db: Session = Depends(get_db)):
    return crud.get_book(db, id)
