from __future__ import annotations

import json
import time
from datetime import datetime, timezone
from typing import TypeVar

from pydantic import BaseModel, ValidationError

from app.db.local_store import read_json, write_json
from app.services.claude import generate

T = TypeVar("T", bound=BaseModel)
_rate_window: dict[str, list[float]] = {}


def allow_ai_request(key: str, limit: int = 30, window_seconds: int = 60) -> bool:
    now = time.monotonic()
    recent = [stamp for stamp in _rate_window.get(key, []) if now - stamp < window_seconds]
    if len(recent) >= limit:
        _rate_window[key] = recent
        return False
    recent.append(now)
    _rate_window[key] = recent
    return True


def parse_json(raw: str) -> dict:
    text = raw.strip()
    if text.startswith("```"):
        text = text.strip("`").replace("json\n", "", 1)
    start, end = text.find("{"), text.rfind("}")
    if start < 0 or end < start:
        raise ValueError("Model did not return a JSON object")
    return json.loads(text[start:end + 1])


def generate_validated(prompt: str, schema: type[T], attempts: int = 3) -> T:
    last_error: Exception | None = None
    for attempt in range(attempts):
        try:
            return schema.model_validate(parse_json(generate(prompt)))
        except (ValueError, json.JSONDecodeError, ValidationError, Exception) as exc:
            last_error = exc
            if attempt + 1 < attempts:
                time.sleep(0.5 * (2 ** attempt))
    raise ValueError(f"AI response failed schema validation after {attempts} attempts: {last_error}")


def thread_context(user_id: str, thread: str, limit: int = 8) -> list[dict]:
    history = read_json("agent_history.json", {})
    entries = history.get(user_id, []) if isinstance(history, dict) else []
    return [entry for entry in entries if entry.get("thread", "assistant") == thread][-limit:]


def append_memory(user_id: str, thread: str, event: dict):
    history = read_json("agent_history.json", {})
    history.setdefault(user_id, []).append({
        **event,
        "thread": thread,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    write_json("agent_history.json", history)


def retrieve_grounding(user_id: str, query: str, limit: int = 5) -> list[dict]:
    """Small local RAG layer over user-confirmed sources and recent agent memory."""
    terms = {word.lower() for word in query.split() if len(word) > 2}
    sources = read_json("verified_sources.json", {})
    sources = sources.get(user_id, []) if isinstance(sources, dict) else []
    scored = []
    for source in sources:
        haystack = json.dumps(source, ensure_ascii=False).lower()
        score = sum(term in haystack for term in terms)
        if score:
            scored.append((score, {"type": "verified_source", "content": source}))
    for entry in thread_context(user_id, "assistant"):
        haystack = json.dumps(entry, ensure_ascii=False).lower()
        score = sum(term in haystack for term in terms)
        if score:
            scored.append((score, {"type": "memory", "content": entry}))
    return [item for _, item in sorted(scored, key=lambda pair: pair[0], reverse=True)[:limit]]


def log_sensitive_event(user_id: str, event: dict):
    logs = read_json("mental_health_review_log.json", {})
    logs.setdefault(user_id, []).append({
        **event,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "review_required": True,
    })
    write_json("mental_health_review_log.json", logs)
