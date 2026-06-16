import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


def _make_engine():
    database_url = os.getenv("DATABASE_URL")

    # If a full DATABASE_URL isn't provided, attempt to build one from
    # discrete DB_* environment variables (useful in container/orchestration).
    if not database_url:
        db_user = os.getenv("DB_USER")
        db_password = os.getenv("DB_PASSWORD")
        db_host = os.getenv("DB_HOST")
        db_port = os.getenv("DB_PORT")
        db_name = os.getenv("DB_NAME")
        if db_user and db_password and db_host and db_port and db_name:
            database_url = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

    # Default to SQLite so the backend works out-of-the-box.
    if not database_url:
        database_url = "sqlite:///./booknest.db"
        

    connect_args = {}
    if database_url.startswith("sqlite"):
        connect_args = {"check_same_thread": False}

    try:
        engine = create_engine(database_url, connect_args=connect_args)
        # Validate connectivity early so a stale/missing DB doesn't crash later.
        with engine.connect():
            pass
        return engine
    except (ModuleNotFoundError, Exception):
        # e.g. postgres driver missing or DB not reachable. Fall back to SQLite.
        engine = create_engine(
            "sqlite:///./booknest.db", connect_args={"check_same_thread": False}
        )
        return engine


engine = _make_engine()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
