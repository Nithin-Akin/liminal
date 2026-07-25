import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db.supabase import supabase
from datetime import date

router = APIRouter()

class TransitionRequest(BaseModel):
    user_id: str
    type: str
    day_1_date: date
    intake: dict

@router.post("/transitions")
def create_transition(body: TransitionRequest):
    try:
        response = supabase.table("transitions").insert({
            "user_id": body.user_id,
            "type": body.type,
            "day_1_date": str(body.day_1_date),
            "intake": body.intake
        }).execute()
    except httpx.ConnectError as exc:
        raise HTTPException(
            status_code=503,
            detail="Could not connect to Supabase. Check SUPABASE_URL and network access.",
        ) from exc

    return {"message": "transition saved", "data": response.data}

@router.get("/transitions/{user_id}")
def get_transition(user_id: str):
    try:
        response = supabase.table("transitions")\
            .select("*")\
            .eq("user_id", user_id)\
            .order("created_at", desc=True)\
            .limit(1)\
            .execute()
    except httpx.ConnectError as exc:
        raise HTTPException(
            status_code=503,
            detail="Could not connect to Supabase. Check SUPABASE_URL and network access.",
        ) from exc
    
    if not response.data:
        return {"transition": None}
    
    transition = response.data[0]
    day_1 = date.fromisoformat(transition["day_1_date"])
    day_number = (date.today() - day_1).days + 1
    
    return {
        "transition": transition,
        "day_number": day_number
    }
