from groq import Groq
import time
from app.core.config import AI_PROVIDER, GROQ_API_KEY, GROQ_MODEL

client = Groq(api_key=GROQ_API_KEY)
MODEL = GROQ_MODEL

def generate(prompt: str) -> str:
    if AI_PROVIDER == "ollama":
        from app.services.local_llm import generate as local_generate
        return local_generate(prompt)
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
    if AI_PROVIDER == "ollama":
        from app.services.local_llm import generate as local_generate
        yield local_generate(prompt)
        return
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        stream=True
    )
    for chunk in response:
        text = chunk.choices[0].delta.content
        if text:
            yield text
