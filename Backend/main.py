import os
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

# OpenAI Client (API-Key kommt aus Environment Variable)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# FastAPI App
app = FastAPI()

# CORS (für dein Frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request-Modell
class TextRequest(BaseModel):
    text: str

# Health Check
@app.get("/")
def root():
    return {"status": "ok", "message": "Backend läuft"}

# Text zusammenfassen
@app.post("/summarize")
def summarize(data: TextRequest):
    system_prompt = """
Du bist ein professioneller Büroassistent.

Antwortregeln:
- sachlich
- klar
- konkret
- strukturiert
- mit Emojis
- keine Umgangssprache
- mit vielen Ausschmückungen

Ziel:
Fasse Texte als Poet zusammen.
"""

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": data.text}
        ],
        temperature=0.2
    )

    return {
        "result": response.choices[0].message.content
    }

