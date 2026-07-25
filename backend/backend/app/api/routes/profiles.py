from datetime import date

from fastapi import APIRouter
from pydantic import BaseModel

from app.db.local_store import read_json, write_json

router = APIRouter()


class ProfileRequest(BaseModel):
    user_id: str = "demo-user"
    profile: dict


@router.post("/profiles")
def save_profile(body: ProfileRequest):
    profiles = read_json("profiles.json", {})
    profiles[body.user_id] = body.profile
    write_json("profiles.json", profiles)

    profile_history = read_json("profile_history.json", {})
    profile_history.setdefault(body.user_id, []).append({
        "profile": body.profile,
        "saved_at": str(date.today()),
    })
    write_json("profile_history.json", profile_history)

    transitions = read_json("transitions_local.json", {})
    transitions[body.user_id] = {
        "type": body.profile.get("transitionType", "moving_city"),
        "day_1_date": body.profile.get("dayOne", str(date.today())),
        "intake": body.profile,
    }
    write_json("transitions_local.json", transitions)

    return {"saved": True, "profile": body.profile}


@router.get("/profiles/{user_id}")
def get_profile(user_id: str):
    profiles = read_json("profiles.json", {})
    return {"profile": profiles.get(user_id)}
