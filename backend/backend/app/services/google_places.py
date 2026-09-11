import httpx
from datetime import datetime, timezone
from app.core.config import GOOGLE_MAPS_API_KEY

PLACE_TYPES = {
    "food": ["restaurant", "cafe", "meal_takeaway"],
    "healthcare": ["pharmacy", "doctor", "hospital", "dentist", "mental_health_clinic"],
    "banking": ["bank", "atm"],
    "connectivity": ["cell_phone_store", "electronics_store"],
    "safety": ["police", "fire_station"],
    "documents": ["post_office", "government_office"],
    "commute": ["transit_station", "bus_station", "subway_station"],
    "housing": ["hotel", "hostel"],
}

def search_places(category: str, query: str, preferences: dict | None = None) -> dict | None:
    if not GOOGLE_MAPS_API_KEY or not query:
        return None
    preferences = preferences or {}
    keys = ("need",) if category == "healthcare" else ("cuisine", "food_preference") if category == "food" else ("card_purpose",) if category == "banking" else ()
    extra = " ".join(str(preferences.get(key, "")) for key in keys if preferences.get(key))
    base = {"healthcare": "healthcare", "food": "restaurants", "banking": "banks and ATMs", "connectivity": "mobile stores", "housing": "PG paying guest coliving hostels"}.get(category, category)
    text_query = f"{extra + ' ' if extra else ''}{base} near {query}"
    type_name = PLACE_TYPES.get(category, ["establishment"])[0]
    need = str(preferences.get("need", "")).lower()
    if category == "healthcare":
        type_name = {"pharmacy": "pharmacy", "general doctor": "doctor", "mental health": None, "dental": "dentist", "emergency care": "hospital", "": None}.get(need, "doctor")
    if category == "food":
        type_name = "restaurant"
    if category == "housing":
        # Google returns hotels for a hotel type, which is not a useful default
        # for a student looking for a monthly PG. Let the text query rank all
        # nearby lodging and coliving results instead.
        type_name = None
    if category == "commute":
        # Origins and destinations can be addresses, campuses, or landmarks,
        # not only transit stations. Use Places text search as a geocoder.
        type_name = None
    body = {"textQuery": text_query, "pageSize": 20, "languageCode": "en", "rankPreference": "DISTANCE"}
    if type_name:
        body["includedType"] = type_name
    field_mask = ",".join((
        "places.id", "places.displayName", "places.formattedAddress", "places.location",
        "places.rating", "places.userRatingCount", "places.priceLevel", "places.websiteUri",
        "places.googleMapsUri", "places.nationalPhoneNumber", "places.currentOpeningHours",
        "places.primaryTypeDisplayName", "places.editorialSummary",
    ))
    try:
        response = httpx.post("https://places.googleapis.com/v1/places:searchText", json=body, headers={"X-Goog-Api-Key": GOOGLE_MAPS_API_KEY, "X-Goog-FieldMask": field_mask}, timeout=20)
        response.raise_for_status()
        payload = response.json()
    except (httpx.HTTPError, ValueError) as exc:
        detail = "Google Places request failed. Check GOOGLE_MAPS_API_KEY, Places API (New), billing, and API restrictions."
        if isinstance(exc, httpx.HTTPStatusError):
            detail = f"{detail} Google returned HTTP {exc.response.status_code}."
        return {"results": [], "source": "Google Places", "search_query": text_query, "place_type": type_name, "warning": detail}

    # A restrictive includedType can hide valid nearby businesses. Retry once
    # with a human-readable query when Google returns no matches.
    places = payload.get("places", [])
    if not places and type_name and category in {"healthcare", "housing", "connectivity"}:
        broad_body = {"textQuery": f"{base} near {query}", "pageSize": 20, "languageCode": "en", "rankPreference": "DISTANCE"}
        try:
            broad = httpx.post("https://places.googleapis.com/v1/places:searchText", json=broad_body, headers={"X-Goog-Api-Key": GOOGLE_MAPS_API_KEY, "X-Goog-FieldMask": field_mask}, timeout=20)
            broad.raise_for_status()
            places = broad.json().get("places", [])
            if places:
                text_query = broad_body["textQuery"]
        except (httpx.HTTPError, ValueError):
            pass
    results = []
    for place in places:
        location = place.get("location", {})
        results.append({"id": f"google-{place.get('id')}", "name": place.get("displayName", {}).get("text", "Unnamed place"), "category": category, "latitude": location.get("latitude"), "longitude": location.get("longitude"), "address": place.get("formattedAddress", ""), "phone": place.get("nationalPhoneNumber"), "website": place.get("websiteUri"), "opening_hours": "; ".join(place.get("currentOpeningHours", {}).get("weekdayDescriptions", [])), "rating": place.get("rating"), "review_count": place.get("userRatingCount"), "price_level": place.get("priceLevel"), "summary": place.get("editorialSummary", {}).get("text"), "map_url": place.get("googleMapsUri"), "directions_url": place.get("googleMapsUri"), "source_url": place.get("googleMapsUri"), "source_type": "google_places", "retrieved_at": datetime.now(timezone.utc).isoformat()})
    return {"results": results, "source": "Google Places", "search_query": text_query, "place_type": type_name}
