from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

try:
    from Backend.Database.database import SessionLocal
    from Backend.Database.models import User
    from Backend.security import hash_password, verify_password
    from Backend.Database.schema import UserCreate, UserLogin
except ModuleNotFoundError:
    from Backend.Database.database import SessionLocal
    from Backend.Database.models import User
    from security import hash_password, verify_password
    from Backend.Database.schema import UserCreate, UserLogin

router = APIRouter()


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
