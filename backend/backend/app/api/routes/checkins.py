from datetime import date

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.db.local_store import read_json, write_json
from app.prompts.checkin import build_checkin_prompt
from app.services.claude import generate

router = APIRouter()


class CheckinRequest(BaseModel):
    user_id: str = "demo-user"
    day_number: int = 1
    transition_type: str = "life transition"
    mood: int
    note: str = ""
    profile: dict = {}


@router.post("/checkins")
def create_checkin(body: CheckinRequest):
    phase_name = get_phase_name(body.day_number)
    prompt = build_checkin_prompt(
        day_number=body.day_number,
        transition_type=body.transition_type,
        mood=body.mood,
        note=body.note,
        phase_name=phase_name,
        phase_context=get_phase_context(phase_name),
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
    checkins.setdefault(body.user_id, []).append(payload)
    write_json("checkins.json", checkins)
    return payload


@router.get("/checkins/status/{user_id}")
def checkin_status(user_id: str):
    checkins = read_json("checkins.json", {})
    latest = (checkins.get(user_id) or [])[-1] if checkins.get(user_id) else None
    today = str(date.today())
    return {
        "checked_in": bool(latest and latest.get("created_at") == today),
        "latest": latest,
        "required_date": today,
    }


def get_phase_name(day_number: int):
    if day_number <= 14:
        return "Landing"
    if day_number <= 35:
        return "Reality"
    if day_number <= 65:
        return "Adjustment"
    return "Emerging"


def get_phase_context(phase_name: str):
    contexts = {
        "Landing": "Days 1-14 should prioritize phone/SIM reliability, temporary housing safety, ID/documents, and low-friction food.",
        "Reality": "Days 15-35 should prioritize bank account setup, repeatable commute, housing comparison, local services, and predictable routines.",
        "Adjustment": "Days 36-65 should optimize rent/commute tradeoffs, healthcare access, social support, and recurring payments.",
        "Emerging": "Days 66-90 should move from survival setup to durable systems: better housing, stronger local network, and financial reliability.",
    }
    return contexts[phase_name]
