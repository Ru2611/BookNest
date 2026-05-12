import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


def _make_engine():
    database_url = os.getenv("DATABASE_URL")

    # Default to SQLite so the backend works out-of-the-box.
    if not database_url:
        database_url = "sqlite:///./booknest.db"

    connect_args = {}
    if database_url.startswith("sqlite"):
        connect_args = {"check_same_thread": False}

    try:
        return create_engine(database_url, connect_args=connect_args)
    except ModuleNotFoundError:
        # e.g. postgres driver missing (psycopg2). Fall back to SQLite.
        return create_engine(
            "sqlite:///./booknest.db", connect_args={"check_same_thread": False}
        )


engine = _make_engine()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
