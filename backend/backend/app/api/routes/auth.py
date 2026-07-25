import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db.supabase import supabase

router = APIRouter()

class RegisterRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(body: RegisterRequest):
    try:
        response = supabase.auth.sign_up({
            "email": body.email,
            "password": body.password
        })
    except httpx.ConnectError as exc:
        raise HTTPException(
            status_code=503,
            detail="Could not connect to Supabase. Check SUPABASE_URL and network access.",
        ) from exc

    return {"message": "registered", "user": response.user}

@router.post("/login")
def login(body: LoginRequest):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": body.email,
            "password": body.password
        })
    except httpx.ConnectError as exc:
        raise HTTPException(
            status_code=503,
            detail="Could not connect to Supabase. Check SUPABASE_URL and network access.",
        ) from exc

    return {"message": "logged in", "session": response.session}
