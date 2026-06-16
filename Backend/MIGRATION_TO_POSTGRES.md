# Migrating from SQLite to PostgreSQL

This snippet shows recommended, minimal steps to switch the app from SQLite to PostgreSQL, create the DB, and migrate data.

Prerequisites
- A running PostgreSQL server (local or remote).
- Access to the project's Python virtualenv.

1) Install a Postgres driver for SQLAlchemy (sync)

```bash
# activate your venv (example)
source Backend/.venv/bin/activate

pip install "psycopg[binary]"  # or: pip install psycopg2-binary
```

2) Create a Postgres user and database (example, Linux)

```bash
# as the postgres OS user
sudo -u postgres psql -c "CREATE USER bookuser WITH PASSWORD 'strongpassword';"
sudo -u postgres psql -c "CREATE DATABASE book_nest OWNER bookuser;"
```

3) Point the app at Postgres

Option A — single URL (recommended):

Add or export a `DATABASE_URL` environment variable (replace values):

```bash
export DATABASE_URL="postgresql://bookuser:strongpassword@localhost:5432/book_nest"
# or add the same line to Backend/.env
```

Option B — discrete variables (supported by the app):

```bash
export DB_USER=bookuser
export DB_PASSWORD=strongpassword
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=book_nest
```

4) Start the app (this will run `models.Base.metadata.create_all()` and create tables)

```bash
# from project root
uvicorn Backend.server:app --reload
# or use your existing start command
```

5) Migrate existing SQLite data (optional)

Recommended: use `pgloader` to migrate from SQLite to Postgres (preserves types):

```bash
# install pgloader (platform-specific)
# example migration command
pgloader sqlite:///path/to/booknest.db postgresql://bookuser:strongpassword@localhost:5432/book_nest
```

Alternative: export CSVs from SQLite and import into Postgres using `psql` and `COPY`.

Notes & Troubleshooting
- The code now supports either `DATABASE_URL` or `DB_USER`/`DB_PASSWORD`/`DB_HOST`/`DB_PORT`/`DB_NAME`.
- If you see driver errors, ensure `psycopg[binary]` (or `psycopg2-binary`) is installed in the virtualenv used to run the app.
- For production, avoid `psycopg2-binary`; prefer `psycopg` or packaging recommended by your deployment.
