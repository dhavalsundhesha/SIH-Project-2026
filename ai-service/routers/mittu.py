import logging
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from prompts.mittu_prompt import SYSTEM_PROMPT, build_user_prompt
from services.llm_client import generate_text, AIServiceNotConfiguredError, AIServiceUnavailableError

logger = logging.getLogger("dharohar.mittu")
router = APIRouter()


class ChatTurn(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class MittuRequest(BaseModel):
    message: str
    history: List[ChatTurn] = []
    guardian_type: Optional[str] = None


class MittuResponse(BaseModel):
    reply: str


@router.post("/mittu-chat", response_model=MittuResponse)
def mittu_chat(payload: MittuRequest):
    user_prompt = build_user_prompt(
        payload.message,
        [t.dict() for t in payload.history],
        payload.guardian_type,
    )
    try:
        reply = generate_text(SYSTEM_PROMPT, user_prompt, max_tokens=400)
    except AIServiceNotConfiguredError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except AIServiceUnavailableError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return MittuResponse(reply=reply)
