from datetime import date

from fastapi import APIRouter, HTTPException
from app.db.local_store import read_json, write_json
from app.core.auth import UserId
from app.core.phases import get_phase
from app.models.schemas import CheckinRequest
from app.prompts.checkin import build_checkin_prompt
from app.services.claude import generate

router = APIRouter()


@router.post("/checkins")
def create_checkin(body: CheckinRequest, user_id: str = UserId):
    phase = get_phase(body.day_number)
    phase_name = phase.name
    prompt = build_checkin_prompt(
        day_number=body.day_number,
        transition_type=body.transition_type,
        mood=body.mood,
        note=body.note,
        phase_name=phase_name,
        phase_context=phase.context,
        profile=body.profile,
        retrieved_memories=[],
    )

    try:
        response = generate(prompt)
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail="Could not generate Groq response. Check GROQ_API_KEY and network access.",
        ) from exc

    payload = {
        "message": "check-in processed",
        "response": response,
        "phase_name": phase_name,
        "day_number": body.day_number,
        "mood": body.mood,
        "note": body.note,
        "created_at": str(date.today()),
    }
    checkins = read_json("checkins.json", {})
    checkins.setdefault(user_id, []).append(payload)
    write_json("checkins.json", checkins)
    return payload


@router.get("/checkins/status/{user_id}")
def checkin_status(user_id: str, authenticated_user_id: str = UserId):
    if user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Cannot access another user's check-ins")
    checkins = read_json("checkins.json", {})
    latest = (checkins.get(user_id) or [])[-1] if checkins.get(user_id) else None
    today = str(date.today())
    return {
        "checked_in": bool(latest and latest.get("created_at") == today),
        "latest": latest,
        "required_date": today,
    }


@router.get("/checkins/history")
def checkin_history(user_id: str = UserId):
    entries = read_json("checkins.json", {}).get(user_id, [])
    return {"entries": entries[-30:], "count": len(entries)}
