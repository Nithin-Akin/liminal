import re
from datetime import datetime, timezone

MONEY = r"(?:₹|rs\.?|inr)\s?[\d,]+(?:\s?[kK])?"

def extract_facts(text: str, category: str) -> dict:
    def first(pattern):
        match = re.search(pattern, text, re.I)
        return match.group(1).strip() if match else None
    patterns = {
        "rent": rf"(?:rent|monthly rent|per month|price)\D{{0,30}}({MONEY})",
        "deposit": rf"(?:deposit|security deposit)\D{{0,30}}({MONEY})",
        "room_type": r"(?:room type|occupancy|sharing)\D{0,30}([A-Za-z0-9 /-]{2,50})",
        "availability": r"(?:availability|available|vacancy|move[- ]?in)\D{0,30}([A-Za-z0-9 /-]{2,50})",
        "opening_hours": r"(?:opening hours|business hours|timings?)\D{0,30}([A-Za-z0-9 :,–-]{4,100})",
        "interest_rate": r"(?:interest rate|annual interest|roi|apr)\D{0,20}([\d.]+\s?%)",
        "annual_fee": rf"(?:annual fee|yearly fee)\D{{0,30}}({MONEY})",
        "joining_fee": rf"(?:joining fee|activation fee)\D{{0,30}}({MONEY})",
        "phone": r"(?:phone|telephone|contact)\D{0,20}([+\d][\d ()-]{7,20})",
    }
    facts = {key: value for key, pattern in patterns.items() if (value := first(pattern))}
    provenance = {key: {"value": value, "confidence": "medium", "source": "retrieved_web_page"} for key, value in facts.items()}
    return {"category": category, "facts": facts, "provenance": provenance, "confidence": "medium" if facts else "low", "retrieved_at": datetime.now(timezone.utc).isoformat()}
