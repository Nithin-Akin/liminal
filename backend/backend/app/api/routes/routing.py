import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.auth import UserId
from app.services.google_places import search_places

router = APIRouter()
class RouteRequest(BaseModel):
    origin_lat: float; origin_lon: float; destination_lat: float; destination_lon: float
    profile: str = "driving"

class PlanRequest(BaseModel):
    origin: str
    destination: str
    profile: str = "driving"

@router.post("/routing/route")
def route(body: RouteRequest, user_id: str = UserId):
    if body.profile not in {"driving", "walking", "cycling"}:
        raise HTTPException(status_code=422, detail="profile must be driving, walking, or cycling")
    url = f"https://router.project-osrm.org/route/v1/{body.profile}/{body.origin_lon},{body.origin_lat};{body.destination_lon},{body.destination_lat}"
    try:
        result = httpx.get(url, params={"overview": "false", "steps": "true"}, timeout=20)
        result.raise_for_status(); payload = result.json()
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail="Open routing service unavailable") from exc
    if payload.get("code") != "Ok": raise HTTPException(status_code=502, detail="No route found")
    route_data = payload["routes"][0]
    return {"profile": body.profile, "distance_m": route_data["distance"], "duration_s": route_data["duration"], "source": "OSRM/OpenStreetMap"}

@router.post("/routing/plan")
def plan(body: PlanRequest, user_id: str = UserId):
    if body.profile not in {"driving", "walking", "cycling"}:
        raise HTTPException(status_code=422, detail="profile must be driving, walking, or cycling")
    origin = search_places("commute", body.origin, {}) or {}
    destination = search_places("commute", body.destination, {}) or {}
    origins = origin.get("results", [])
    destinations = destination.get("results", [])
    if not origins or not destinations:
        raise HTTPException(status_code=422, detail="Could not locate one or both places. Include city and country.")
    a, b = origins[0], destinations[0]
    result = route(RouteRequest(origin_lat=a["latitude"], origin_lon=a["longitude"], destination_lat=b["latitude"], destination_lon=b["longitude"], profile=body.profile), user_id)
    return {**result, "origin": {"query": body.origin, "name": a["name"], "address": a["address"], "latitude": a["latitude"], "longitude": a["longitude"]}, "destination": {"query": body.destination, "name": b["name"], "address": b["address"], "latitude": b["latitude"], "longitude": b["longitude"]}}
