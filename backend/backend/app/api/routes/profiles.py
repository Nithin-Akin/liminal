from datetime import date

from fastapi import APIRouter
from app.db.local_store import read_json, write_json
from app.core.auth import UserId
from app.models.schemas import ProfileRequest

router = APIRouter()


@router.post("/profiles")
def save_profile(body: ProfileRequest, user_id: str = UserId):
    profiles = read_json("profiles.json", {})
    profiles[user_id] = body.profile
    write_json("profiles.json", profiles)

    profile_history = read_json("profile_history.json", {})
    profile_history.setdefault(user_id, []).append({
        "profile": body.profile,
        "saved_at": str(date.today()),
    })
    write_json("profile_history.json", profile_history)

    transitions = read_json("transitions_local.json", {})
    transitions[user_id] = {
        "type": body.profile.get("transitionType", "moving_city"),
        "day_1_date": body.profile.get("dayOne", str(date.today())),
        "intake": body.profile,
    }
    write_json("transitions_local.json", transitions)

    return {"saved": True, "profile": body.profile}


@router.get("/profiles/{user_id}")
def get_profile(user_id: str, authenticated_user_id: str = UserId):
    if user_id != authenticated_user_id:
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Cannot access another user's profile")
    profiles = read_json("profiles.json", {})
    return {"profile": profiles.get(user_id)}
