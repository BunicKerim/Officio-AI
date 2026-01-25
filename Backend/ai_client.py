import os
from dotenv import load_dotenv
from openai import OpenAI
from openai import OpenAIError

load_dotenv()

API_KEY = os.getenv("OPENAI_API_KEY")

if not API_KEY:
    raise RuntimeError("OPENAI_API_KEY nicht gefunden")

client = OpenAI(api_key=API_KEY)

def call_ai(system_role: str, user_text: str) -> str:
    try:
        print("🔌 OpenAI request gestartet")

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_role},
                {"role": "user", "content": user_text}
            ],
            temperature=0.2
        )

        result = response.choices[0].message.content.strip()
        print("✅ OpenAI response erhalten")
        return result

    except OpenAIError as e:
        print("❌ OpenAI Fehler:", str(e))
        return "❌ Fehler bei der KI-Verarbeitung."

    except Exception as e:
        print("❌ Unerwarteter Fehler:", str(e))
        return "❌ Interner Serverfehler bei der KI."
