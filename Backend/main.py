import os
from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware


# OpenAI Client initialisieren
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# FastAPI App
app = FastAPI()

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

# Health-Check
@app.get("/")
def health():
    return {"status": "ok"}

# KI-Zusammenfassung
@app.post("/summarize")
def summarize(data: TextRequest):
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "Du bist ein professioneller Büroassistent."
                    "Fasse Texte klar, strukturiert und sachlich zusammen."
                )
            },
            {
                "role": "user",
                "content": data.text
            }
        ],
        temperature=0.3
    )

    return {
        "result": response.choices[0].message.content
    }
# Server starten