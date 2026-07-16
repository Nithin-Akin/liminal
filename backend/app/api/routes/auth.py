from fastapi import APIRouter
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
    response = supabase.auth.sign_up({
        "email": body.email,
        "password": body.password
    })
    return {"message": "registered", "user": response.user}

@router.post("/login")
def login(body: LoginRequest):
    response = supabase.auth.sign_in_with_password({
        "email": body.email,
        "password": body.password
    })
    return {"message": "logged in", "session": response.session}