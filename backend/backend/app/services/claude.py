from groq import Groq
import time
from app.core.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)
MODEL = "llama-3.1-8b-instant"

def generate(prompt: str) -> str:
    last_error = None
    for attempt in range(3):
        try:
            response = client.chat.completions.create(model=MODEL, messages=[{"role": "user", "content": prompt}])
            return response.choices[0].message.content
        except Exception as exc:
            last_error = exc
            if attempt < 2: time.sleep(2 ** attempt)
    raise last_error

def stream(prompt: str):
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        stream=True
    )
    for chunk in response:
        text = chunk.choices[0].delta.content
        if text:
            yield text
