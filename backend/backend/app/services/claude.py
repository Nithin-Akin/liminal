from groq import Groq
from app.core.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)
MODEL = "llama-3.3-70b-versatile"

def generate(prompt: str) -> str:
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

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