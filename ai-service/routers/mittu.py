from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from services.mittu_llm_client import chat_with_mittu

router = APIRouter()


class MittuRequest(BaseModel):
    message: str
    history: list = Field(default_factory=list)


@router.post("/")
async def mittu_chat(request: MittuRequest):

    if not request.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message is required"
        )

    try:
        answer = chat_with_mittu(
            request.message,
            request.history
        )

        return {
            "answer": answer
        }

    except Exception as error:
        print("Mittu AI Error:", error)

        raise HTTPException(
            status_code=500,
            detail="Failed to generate Mittu response"
        )