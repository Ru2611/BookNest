from fastapi import APIRouter, Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from Database.database import SessionLocal
from Database.models import User
from Database.schema import UserCreate, UserLogin
from auth import hash_password, verify_password
from Database.models import Book
from Database.schema import BookOut
from fastapi import Body
from fastapi.middleware.cors import CORSMiddleware

router = APIRouter()


app = FastAPI()


# Add this configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", 
    "http://127.0.0.1:5174",], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    new_user = User(
        name=user.name,
        phone=user.phone,
        email=user.email,
        password_hash=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "user_id": new_user.id}


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if not existing or not verify_password(user.password, existing.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {"message": "Login successful", "user_id": existing.id}


@router.post("/books/{book_id}/rate")
def rate_book(book_id: int, payload: dict = Body(...), db: Session = Depends(get_db)):
    """Accepts a JSON body with `rating` (number 1-5) and updates book rating."""
    rating = payload.get("rating")
    if rating is None:
        raise HTTPException(status_code=400, detail="Missing rating")
    try:
        rating_val = float(rating)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid rating value")

    if rating_val < 0 or rating_val > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 0 and 5")

    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    # Update aggregate fields
    book.rating_sum = (book.rating_sum or 0.0) + rating_val
    book.rating_count = (book.rating_count or 0) + 1
    db.add(book)
    db.commit()
    db.refresh(book)

    avg = float(book.rating_sum) / book.rating_count if book.rating_count else 0.0
    return {"message": "rating recorded", "avg_rating": avg, "rating_count": book.rating_count}
# This introduces your router to the main app!
app.include_router(router)