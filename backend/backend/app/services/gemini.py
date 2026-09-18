import httpx
from app.core.config import GEMINI_API_KEY, GEMINI_MODEL

def generate(prompt: str) -> str:
    if not GEMINI_API_KEY or not GEMINI_API_KEY.strip():
        raise RuntimeError("GEMINI_API_KEY is not configured")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
    payload = {"contents": [{"parts": [{"text": prompt}]}], "generationConfig": {"temperature": 0.1, "responseMimeType": "application/json"}}
    response = httpx.post(url, params={"key": GEMINI_API_KEY}, json=payload, timeout=45)
    if response.is_error:
        try:
            detail = response.json().get("error", {}).get("message", response.text)
        except ValueError:
            detail = response.text
        raise RuntimeError(f"Gemini API HTTP {response.status_code}: {detail[:300]}")
    data = response.json()
    try:
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError) as exc:
        raise RuntimeError("Gemini returned no usable content") from exc
