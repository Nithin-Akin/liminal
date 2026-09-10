from datetime import date
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.auth import UserId
from app.db.local_store import read_json, write_json

router = APIRouter()

class TransitionRequest(BaseModel):
    type: str
    day_1_date: date
    intake: dict

@router.post("/transitions")
def create_transition(body: TransitionRequest, user_id: str = UserId):
    transitions = read_json("transitions_local.json", {})
    transitions[user_id] = {"type": body.type, "day_1_date": str(body.day_1_date), "intake": body.intake}
    write_json("transitions_local.json", transitions)
    return {"message": "transition saved", "data": transitions[user_id]}

@router.get("/transitions/{user_id}")
def get_transition(user_id: str, authenticated_user_id: str = UserId):
    if user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Cannot access another user's transition")
    transition = read_json("transitions_local.json", {}).get(user_id)
    if not transition:
        return {"transition": None}
    day_1 = date.fromisoformat(transition["day_1_date"])
    return {"transition": transition, "day_number": (date.today() - day_1).days + 1}
