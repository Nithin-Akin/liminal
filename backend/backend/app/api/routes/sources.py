from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, AnyHttpUrl, Field
from datetime import datetime, timezone
from app.core.auth import UserId
from app.services.source_verify import verify_url
from app.db.local_store import read_json, write_json

router = APIRouter()
class SourceRequest(BaseModel):
    url: AnyHttpUrl

@router.post("/sources/verify")
def verify_source(body: SourceRequest, user_id: str = UserId):
    try:
        result = verify_url(str(body.url))
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Source could not be retrieved: {exc}") from exc
    result["user_id"] = user_id
    return result

class ConfirmRequest(BaseModel):
    url: AnyHttpUrl
    category: str
    facts: dict[str, str] = Field(default_factory=dict)
    confidence: str = "low"

@router.post("/sources/confirm")
def confirm_source(body: ConfirmRequest, user_id: str = UserId):
    if body.confidence not in {"high", "medium", "low"}:
        raise HTTPException(status_code=422, detail="confidence must be high, medium, or low")
    saved = read_json("verified_sources.json", {})
    saved.setdefault(user_id, []).append({"url": str(body.url), "category": body.category, "facts": body.facts, "confidence": body.confidence, "verified_by": user_id, "verified_at": datetime.now(timezone.utc).isoformat()})
    write_json("verified_sources.json", saved)
    return {"saved": True, "source": saved[user_id][-1]}

@router.get("/sources/verified")
def verified_sources(user_id: str = UserId):
    return {"sources": read_json("verified_sources.json", {}).get(user_id, [])}
