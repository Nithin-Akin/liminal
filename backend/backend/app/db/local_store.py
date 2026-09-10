import json
import sqlite3
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).resolve().parents[2] / "data"
DATA_DIR.mkdir(exist_ok=True)
DB_PATH = DATA_DIR / "liminal.sqlite3"

def _db():
    connection = sqlite3.connect(DB_PATH)
    connection.execute("CREATE TABLE IF NOT EXISTS state (filename TEXT PRIMARY KEY, payload TEXT NOT NULL)")
    return connection


def read_json(filename: str, fallback: Any):
    connection = _db()
    row = connection.execute("SELECT payload FROM state WHERE filename = ?", (filename,)).fetchone()
    if row:
        connection.close()
        try: return json.loads(row[0])
        except json.JSONDecodeError: return fallback
    path = DATA_DIR / filename
    if not path.exists():
        connection.close()
        return fallback

    try:
        value = json.loads(path.read_text())
        connection.execute("INSERT OR REPLACE INTO state(filename, payload) VALUES (?, ?)", (filename, json.dumps(value, ensure_ascii=False)))
        connection.commit(); connection.close()
        return value
    except json.JSONDecodeError:
        connection.close()
        return fallback


def write_json(filename: str, data: Any):
    connection = _db()
    connection.execute("INSERT OR REPLACE INTO state(filename, payload) VALUES (?, ?)", (filename, json.dumps(data, ensure_ascii=False)))
    connection.commit(); connection.close()
    path = DATA_DIR / filename
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False))
    return data
