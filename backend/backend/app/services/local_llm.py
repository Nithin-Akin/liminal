import httpx

from app.core.config import OLLAMA_MODEL, OLLAMA_URL


def generate(prompt: str) -> str:
    try:
        response = httpx.post(
            f"{OLLAMA_URL.rstrip('/')}/api/generate",
            json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False, "format": "json", "options": {"temperature": 0.1}},
            timeout=120,
        )
        response.raise_for_status()
        data = response.json()
        text = data.get("response")
        if not text:
            raise RuntimeError("Ollama returned no response")
        return text
    except httpx.ConnectError as exc:
        raise RuntimeError("Ollama is not running. Start it with `ollama serve`.") from exc
    except httpx.HTTPStatusError as exc:
        detail = exc.response.text[:300]
        raise RuntimeError(f"Ollama HTTP {exc.response.status_code}: {detail}") from exc
