from fastapi import APIRouter, Query
from app.core.auth import UserId
from app.db.local_store import read_json
from app.services.open_data import research

router = APIRouter()

@router.get("/research/{category}")
def category_research(category: str, user_id: str = UserId, need: str = Query(""), cuisine: str = Query(""), max_price: int | None = Query(None), card_purpose: str = Query(""), housing_type: str = Query(""), max_rent: int | None = Query(None)):
    profile = read_json("profiles.json", {}).get(user_id, {})
    result = research(category, profile.get("city", ""), profile.get("locality", ""), profile.get("destinationAddress") or profile.get("destination", ""), budget=profile.get("monthlyBudget"), housing_status=housing_type or profile.get("housingStatus", ""), preferences={"food_preference": profile.get("foodPreference", ""), "need": need, "cuisine": cuisine, "max_price": max_price, "card_purpose": card_purpose, "housing_type": housing_type, "max_rent": max_rent})
    result["location_label"] = profile.get("destinationAddress") or ", ".join(part for part in (profile.get("destination"), profile.get("locality"), profile.get("city")) if part)
    result["request"] = {"need": need, "cuisine": cuisine, "max_price": max_price, "card_purpose": card_purpose, "monthly_budget": profile.get("monthlyBudget"), "food_preference": profile.get("foodPreference")}
    if category == "banking" and card_purpose and (profile.get("monthlyBudget") or 0) < 15000:
        result["budget_warning"] = "Your saved monthly budget is limited. Treat a credit card as a payment tool, not extra income; compare fees, avoid revolving balances, and only use it when repayment is already covered."
    return result
