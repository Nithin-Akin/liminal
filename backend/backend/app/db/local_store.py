import json
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).resolve().parents[2] / "data"
DATA_DIR.mkdir(exist_ok=True)


def read_json(filename: str, fallback: Any):
    path = DATA_DIR / filename
    if not path.exists():
        return fallback

    try:
        return json.loads(path.read_text())
    except json.JSONDecodeError:
        return fallback


def write_json(filename: str, data: Any):
    path = DATA_DIR / filename
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False))
    return data
