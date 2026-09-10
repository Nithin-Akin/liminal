from app.db.local_store import read_json

def get_memories(query_text: str, user_id: str, limit: int = 3) -> list:
    if not query_text:
        return []

    memories = read_json("memories.json", {})
    return [item["content"] for item in memories.get(user_id, [])[:limit] if "content" in item]
