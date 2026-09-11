import os
import json

from google import genai
from dotenv import load_dotenv


load_dotenv()


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


async def generate_quiz_with_ai(prompt):

    response = client.models.generate_content(
        model=os.getenv("MODEL_NAME", "gemini-2.5-flash"),
        contents=prompt
    )

    text = response.text.strip()

    # Remove accidental Markdown
    if text.startswith("```"):
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

    quiz = json.loads(text)

    return quiz