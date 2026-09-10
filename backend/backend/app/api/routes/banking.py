import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.core.auth import UserId
from app.db.local_store import read_json
from app.services.gemini import generate

router = APIRouter()

class BankingRequest(BaseModel):
    purpose: str = "general spending"

class CardOption(BaseModel):
    name: str
    issuer: str
    card_type: str
    annual_fee: str
    joining_fee: str
    interest_rate: str
    forex_fee: str
    rewards: str
    eligibility: str
    best_for: str
    caution: str
    source_url: str = Field(description="Official issuer product page")

class BankingResponse(BaseModel):
    summary: str
    affordability_note: str
    options: list[CardOption]
    checked_at: str

@router.post("/banking/options", response_model=BankingResponse)
def banking_options(body: BankingRequest, user_id: str = UserId):
    profile = read_json("profiles.json", {}).get(user_id, {})
    budget = profile.get("monthlyBudget", "not provided")
    prompt = f"""You are a careful Indian personal-finance comparison researcher.
Return ONLY valid JSON matching this exact shape:
{{"summary":"...","affordability_note":"...","options":[{{"name":"...","issuer":"...","card_type":"...","annual_fee":"...","joining_fee":"...","interest_rate":"...","forex_fee":"...","rewards":"...","eligibility":"...","best_for":"...","caution":"...","source_url":"https://official-issuer-domain/..."}}],"checked_at":"ISO timestamp"}}
Compare 4 currently available Indian credit cards for purpose: {body.purpose}.
User monthly budget: {budget}. User city: {profile.get('city','not provided')}.
Use only facts you know with high confidence. Never invent a fee, rate, reward, or eligibility rule. If a field is not reliably known, write "Verify on issuer page". Every source_url must be the issuer's official product page, never Google search, a blog, or a fabricated URL. Explain affordability conservatively and say when a credit card is a poor choice for this budget. No markdown and no extra keys."""
    try:
        raw = generate(prompt)
        data = json.loads(raw[raw.find("{"):raw.rfind("}") + 1])
        return BankingResponse.model_validate(data)
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Banking comparison unavailable. Check GEMINI_API_KEY and Gemini API access.") from exc
