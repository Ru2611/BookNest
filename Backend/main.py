from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from Backend.Database import models, schema

try:
    from Backend import crud
    from Backend.Database.database import SessionLocal, engine
    from Backend.Route.router import router
except ModuleNotFoundError:
    import crud, Backend.Database.models as models, Backend.Database.schema as schema
    from Backend.Database.database import SessionLocal, engine
    from Backend.Route.router import router

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
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


@app.post("/books")
def create(book: schema.BookCreate, db: Session = Depends(get_db)):
    return crud.create_book(db, book)


@app.get("/books")
def read_books(db: Session = Depends(get_db)):
    return crud.get_books(db)


@app.get("/books/{id}")
def read_book(id: int, db: Session = Depends(get_db)):
    return crud.get_book(db, id)
