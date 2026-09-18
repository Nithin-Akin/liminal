from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.6-flash").strip()
AI_PROVIDER = os.getenv("AI_PROVIDER", "ollama").strip().lower()
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434").strip()
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1:8b").strip()
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")
DEV_AUTH = os.getenv("DEV_AUTH", "false").lower() == "true"
DEV_LOGIN_EMAIL = os.getenv("DEV_LOGIN_EMAIL", "")
DEV_LOGIN_PASSWORD = os.getenv("DEV_LOGIN_PASSWORD", "")
