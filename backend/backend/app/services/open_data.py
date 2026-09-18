from __future__ import annotations

import json
import time
from urllib.parse import quote_plus

import httpx

from app.db.local_store import read_json, write_json
from app.services.google_places import search_places

USER_AGENT = "LiminalTravellerOS/0.1 (local open-data research)"
OVERPASS = "https://overpass-api.de/api/interpreter"
NOMINATIM = "https://nominatim.openstreetmap.org/search"

CATEGORY_TAGS = {
    "housing": ['nwr["amenity"~"hostel|hotel|guest_house"]', 'nwr["tourism"~"hostel|hotel|guest_house"]'],
    "banking": ['nwr["amenity"="bank"]', 'nwr["amenity"="atm"]'],
    "connectivity": ['nwr["shop"~"mobile_phone|electronics"]'],
    "essentials": ['nwr["amenity"~"restaurant|cafe|fast_food|pharmacy|clinic|hospital"]'],
    "safety": ['nwr["amenity"~"police|fire_station"]'],
    "commute": ['nwr["public_transport"~"platform|station|stop_position"]', 'nwr["railway"~"station|subway|tram_stop"]', 'nwr["highway"="bus_stop"]'],
    "healthcare": ['nwr["amenity"~"clinic|hospital|pharmacy"]'],
    "documents": ['nwr["office"~"government|administrative"]', 'nwr["amenity"="post_office"]'],
    "food": ['nwr["amenity"~"restaurant|cafe|fast_food|food_court"]'],
}


def research(category: str, city: str, locality: str, destination: str, limit: int = 30, budget=None, housing_status: str = "", preferences: dict | None = None) -> dict:
    category = category.lower()
    query_text = ", ".join(part for part in (destination, locality, city) if part)
    cache = read_json("open_data_cache.json", {})
    preferences = preferences or {}
    cache_key = f"v5:{category}:{query_text.lower()}:{budget}:{housing_status.lower()}:{preferences}"
    cached = cache.get(cache_key)
    if cached and time.time() - cached.get("cached_at_epoch", 0) < 3600:
        return cached["payload"]

    google = search_places(category, query_text, preferences)
    if google is not None:
        payload = {"category": category, "query": query_text, "budget": budget, "preferences": preferences, "source": google["source"], "results": google["results"], "warning": google.get("warning") or (f"No Google Places matched '{google['search_query']}' as {google['place_type']}. Try a broader need or verify the destination address." if not google["results"] else "Ratings, reviews, price levels, and hours come from Google Places. Prices and availability still require verification.")}
        cache[cache_key] = {"cached_at_epoch": time.time(), "payload": payload}; write_json("open_data_cache.json", cache)
        return payload

    location = geocode(query_text)
    if not location:
        return {"category": category, "query": query_text, "source": "OpenStreetMap", "results": [], "warning": "Location could not be geocoded."}
    lat, lon = location["lat"], location["lon"]
    clauses = CATEGORY_TAGS.get(category, CATEGORY_TAGS["essentials"])
    overpass_query = "[out:json][timeout:25];(" + "".join(f"{clause}(around:5000,{lat},{lon});" for clause in clauses) + ");out center tags;"
    try:
        response = httpx.post(OVERPASS, data=overpass_query, headers={"User-Agent": USER_AGENT}, timeout=35)
        response.raise_for_status()
        elements = response.json().get("elements", [])[:limit]
    except httpx.HTTPError as exc:
        return {"category": category, "query": query_text, "source": "OpenStreetMap", "results": [], "warning": f"Open data lookup unavailable: {exc}"}

    results = []
    for item in elements:
        tags = item.get("tags", {})
        center = item.get("center", item)
        name = tags.get("name")
        if not name:
            continue
        if category == "housing" and any(word in name.lower() for word in ("hotel", "holiday home", "motel", "resort")) and "hotel" not in housing_status.lower():
            continue
        result = {
            "id": f"osm-{item.get('type')}-{item.get('id')}",
            "name": name,
            "category": category,
            "latitude": center.get("lat"),
            "longitude": center.get("lon"),
            "address": ", ".join(value for key in ("addr:housenumber", "addr:street", "addr:suburb", "addr:city") if (value := tags.get(key))),
            "phone": tags.get("phone") or tags.get("contact:phone"),
            "website": tags.get("website") or tags.get("contact:website"),
            "opening_hours": tags.get("opening_hours"),
            "map_url": f"https://www.openstreetmap.org/{item.get('type')}/{item.get('id')}",
            "directions_url": f"https://www.openstreetmap.org/directions?to={center.get('lat')}%2C{center.get('lon')}",
            "source_url": tags.get("website") or tags.get("contact:website") or f"https://www.openstreetmap.org/{item.get('type')}/{item.get('id')}",
            "source_type": "openstreetmap",
            "retrieved_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "raw_tags": tags,
        }
        results.append(result)
    payload = {"category": category, "query": query_text, "budget": budget, "preferences": preferences, "center": location, "source": "OpenStreetMap", "results": results, "warning": f"Monthly budget: {budget or 'not provided'}. Open data may omit prices, reviews, rates, services, and availability; verify commercial details before committing."}
    cache[cache_key] = {"cached_at_epoch": time.time(), "payload": payload}
    write_json("open_data_cache.json", cache)
    return payload


def geocode(query: str) -> dict | None:
    if not query:
        return None
    try:
        response = httpx.get(NOMINATIM, params={"q": query, "format": "jsonv2", "limit": 1}, headers={"User-Agent": USER_AGENT}, timeout=15)
        response.raise_for_status()
        item = response.json()[0]
        return {"lat": float(item["lat"]), "lon": float(item["lon"]), "display_name": item.get("display_name", query)}
    except (httpx.HTTPError, IndexError, KeyError, ValueError):
        return None
