from groq import Groq
from app.core.config import GROQ_API_KEY

# Groq doesn't have embeddings — we use a free local model instead
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def embed(text: str) -> list:
    embedding = model.encode(text)
    return embedding.tolist()