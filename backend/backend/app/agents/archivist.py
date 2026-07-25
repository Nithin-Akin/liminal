from app.db.supabase import supabase
from app.services.embeddings import embed

def get_memories(query_text: str, user_id: str, limit: int = 3) -> list:
    if not query_text:
        return []

    query_embedding = embed(query_text)

    result = supabase.rpc("match_memories", {
        "query_embedding": query_embedding,
        "match_user_id": user_id,
        "match_count": limit
    }).execute()

    if not result.data:
        return []

    return [m["content"] for m in result.data]