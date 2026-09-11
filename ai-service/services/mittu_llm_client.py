import os

from google import genai
from dotenv import load_dotenv

from prompts.mittu_prompt import MITTU_SYSTEM_PROMPT

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def chat_with_mittu(message, history=None):

    history = history or []

    chat = client.chats.create(
        model=os.getenv("MODEL_NAME", "gemini-3.8-flash"),
        history=history,
        config={
            "system_instruction": MITTU_SYSTEM_PROMPT
        }
    )

    response = chat.send_message(
        message=message
    )

    return response.text