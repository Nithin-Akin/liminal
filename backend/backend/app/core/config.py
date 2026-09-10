from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")
DEV_AUTH = os.getenv("DEV_AUTH", "false").lower() == "true"
DEV_LOGIN_EMAIL = os.getenv("DEV_LOGIN_EMAIL", "")
DEV_LOGIN_PASSWORD = os.getenv("DEV_LOGIN_PASSWORD", "")
