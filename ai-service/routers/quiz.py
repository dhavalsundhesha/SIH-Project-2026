from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from prompts.quiz_prompt import build_quiz_prompt
from services.quiz_llm_client import generate_quiz_with_ai


router = APIRouter()


class QuizRequest(BaseModel):
    topic: str
    difficulty: str
    questionCount: int


@router.post("/")
async def generate_quiz(request: QuizRequest):

    if not request.topic.strip():
        raise HTTPException(
            status_code=400,
            detail="Topic is required"
        )

    if request.difficulty not in ["Easy", "Medium", "Hard"]:
        raise HTTPException(
            status_code=400,
            detail="Difficulty must be Easy, Medium or Hard"
        )

    if request.questionCount < 1 or request.questionCount > 20:
        raise HTTPException(
            status_code=400,
            detail="Question count must be between 1 and 20"
        )

    prompt = build_quiz_prompt(
        topic=request.topic,
        difficulty=request.difficulty,
        question_count=request.questionCount
    )

    try:

        quiz = await generate_quiz_with_ai(prompt)

        if not isinstance(quiz, dict):
            raise Exception("Invalid quiz format")

        if "questions" not in quiz:
            raise Exception("Questions missing")

        if len(quiz["questions"]) != request.questionCount:
            raise Exception(
                f"Expected {request.questionCount} questions, "
                f"got {len(quiz['questions'])}"
            )

        return quiz

    except Exception as error:

        print("Quiz AI Error:", error)

        raise HTTPException(
            status_code=500,
            detail="Failed to generate AI quiz"
        )