import json
import os
from pathlib import Path

from sqlalchemy import text


def _is_sqlite(engine) -> bool:
    try:
        return str(getattr(engine.url, "drivername", "")).startswith("sqlite")
    except Exception:
        return False


def ensure_books_schema(engine) -> None:
    """
    Minimal SQLite schema bootstrap for dev:
    - SQLAlchemy `create_all()` will not ALTER existing tables.
    - We add new columns if they're missing.
    """
    if not _is_sqlite(engine):
        return

    with engine.begin() as conn:
        existing = {
            row[1]
            for row in conn.execute(text("PRAGMA table_info(books)")).fetchall()
        }
        desired = {
            "condition": "VARCHAR",
            "seller_name": "VARCHAR",
            "seller_city": "VARCHAR",
            "rating_sum": "FLOAT",
            "rating_count": "INTEGER",
        }
        for column, column_type in desired.items():
            if column in existing:
                continue
            conn.execute(text(f"ALTER TABLE books ADD COLUMN {column} {column_type}"))


def seed_books_if_empty(engine) -> None:
    if not _is_sqlite(engine):
        return

    seed_path = Path(__file__).resolve().parents[1] / "seed_books.json"
    if not seed_path.exists():
        return

    with engine.begin() as conn:
        count = conn.execute(text("SELECT COUNT(1) FROM books")).scalar() or 0
        if int(count) > 0:
            return

        try:
            seed = json.loads(seed_path.read_text(encoding="utf-8"))
        except Exception:
            return

        if not isinstance(seed, list) or not seed:
            return

        for b in seed:
            if not isinstance(b, dict):
                continue
            conn.execute(
                text(
                    """
                    INSERT INTO books
                      (title, author, genre, condition, price, type, description, image, seller_name, seller_city)
                    VALUES
                      (:title, :author, :genre, :condition, :price, :type, :description, :image, :seller_name, :seller_city)
                    """
                ),
                {
                    "title": b.get("title", ""),
                    "author": b.get("author", ""),
                    "genre": b.get("genre", ""),
                    "condition": b.get("condition", ""),
                    "price": float(b.get("price", 0) or 0),
                    "type": b.get("type", "sell") or "sell",
                    "description": b.get("description", ""),
                    "image": b.get("image", ""),
                    "seller_name": (b.get("seller") or {}).get("name", "")
                    if isinstance(b.get("seller"), dict)
                    else (b.get("seller_name") or ""),
                    "seller_city": (b.get("seller") or {}).get("city", "")
                    if isinstance(b.get("seller"), dict)
                    else (b.get("seller_city") or ""),
                },
            )

