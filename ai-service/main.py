from fastapi import FastAPI

from routers.mittu import router as mittu_router
from routers.quiz import router as quiz_router


app = FastAPI(
    title="DHAROHAR AI Service",
    description="AI service for DHAROHAR learning platform",
    version="1.0.0"
)


app.include_router(
    mittu_router,
    prefix="/mittu"
)


app.include_router(
    quiz_router,
    prefix="/quiz"
)


@app.get("/")
def root():
    return {
        "service": "DHAROHAR AI Service",
        "status": "running"
    }