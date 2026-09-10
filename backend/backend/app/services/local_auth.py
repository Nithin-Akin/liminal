import hashlib
import hmac
import secrets
from app.db.local_store import read_json, write_json

def password_hash(password: str, salt: str | None = None) -> str:
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 200_000).hex()
    return f"pbkdf2_sha256$200000${salt}${digest}"

def verify_password(password: str, encoded: str) -> bool:
    try:
        algorithm, rounds, salt, expected = encoded.split("$", 3)
        actual = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), int(rounds)).hex()
        return algorithm == "pbkdf2_sha256" and hmac.compare_digest(actual, expected)
    except (ValueError, TypeError):
        return False

def create_session(email: str) -> str:
    token = secrets.token_urlsafe(32)
    sessions = read_json("sessions.json", {})
    sessions[token] = email
    write_json("sessions.json", sessions)
    return token

def user_for_token(token: str) -> str | None:
    return read_json("sessions.json", {}).get(token)
