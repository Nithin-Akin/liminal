from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db.local_store import read_json, write_json
from app.services.local_auth import create_session, password_hash, verify_password
from app.core.config import DEV_LOGIN_EMAIL, DEV_LOGIN_PASSWORD


def migrate_demo_state(user_id: str):
    if user_id == "demo-user":
        return
    filenames = ("profiles.json", "profile_history.json", "transitions_local.json", "generated_tasks.json", "rewards.json", "checkins.json", "agent_history.json")
    for filename in filenames:
        state = read_json(filename, {})
        if user_id not in state and "demo-user" in state:
            state[user_id] = state["demo-user"]
            write_json(filename, state)

router = APIRouter()

class Credentials(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(body: Credentials):
    email = str(body.email).lower()
    users = read_json("users.json", {})
    if email in users:
        raise HTTPException(status_code=409, detail="Email is already registered")
    users[email] = {"id": email, "email": email, "password_hash": password_hash(body.password)}
    write_json("users.json", users)
    return {"message": "registered", "user": {"id": email, "email": email}}

@router.post("/login")
def login(body: Credentials):
    email = str(body.email).lower()
    users = read_json("users.json", {})
    user = users.get(email)
    if not user and email == DEV_LOGIN_EMAIL.lower() and body.password == DEV_LOGIN_PASSWORD:
        user = {"id": email, "email": email, "password_hash": password_hash(body.password)}
        users[email] = user
        write_json("users.json", users)
    if not user or not verify_password(body.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    migrate_demo_state(email)
    return {"message": "logged in", "session": {"access_token": create_session(email)}, "user": {"id": email, "email": email}}
