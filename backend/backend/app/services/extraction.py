import re
from datetime import datetime, timezone

MONEY = r"(?:₹|rs\.?|inr)\s?[\d,]+(?:\s?[kK])?"

def extract_facts(text: str, category: str) -> dict:
    def first(pattern):
        match = re.search(pattern, text, re.I)
        return match.group(1).strip() if match else None
    facts = {
        "rent": first(rf"(?:rent|monthly|per month|price)\D{{0,30}}({MONEY})"),
        "deposit": first(rf"(?:deposit|security)\D{{0,30}}({MONEY})"),
        "room_type": first(r"(?:room type|occupancy|sharing)\D{0,30}([A-Za-z0-9 /-]{2,50})"),
        "availability": first(r"(?:availability|available|vacancy)\D{0,30}([A-Za-z0-9 /-]{2,50})"),
        "opening_hours": first(r"(?:opening hours|hours|timings?)\D{0,30}([A-Za-z0-9 :,–-]{4,80})"),
        "interest_rate": first(r"(?:interest rate|roi)\D{0,20}([\d.]+\s?%)"),
    }
    facts = {key: value for key, value in facts.items() if value}
    return {"category": category, "facts": facts, "confidence": "low", "retrieved_at": datetime.now(timezone.utc).isoformat()}
