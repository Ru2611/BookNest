import hashlib
import secrets


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    iterations = 120_000
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt.encode("utf-8"), iterations
    )
    return f"pbkdf2_sha256${iterations}${salt}${digest.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        scheme, iterations_s, salt, hash_hex = stored.split("$", 3)
        if scheme != "pbkdf2_sha256":
            return False
        iterations = int(iterations_s)
        digest = hashlib.pbkdf2_hmac(
            "sha256", password.encode("utf-8"), salt.encode("utf-8"), iterations
        ).hex()
        return secrets.compare_digest(digest, hash_hex)
    except Exception:
        return False

