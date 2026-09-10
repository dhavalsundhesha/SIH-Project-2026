import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import mittu

app = FastAPI(title="Dharohar AI Service", version="1.0.0")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.include_router(mittu.router, tags=["mittu"])


@app.get("/health")
def health():
    return {"status": "ok", "service": "dharohar-ai-service",
            "cloud_ai_configured": bool(os.getenv("CLOUD_AI_API_KEY") or os.getenv("ANTHROPIC_API_KEY"))}
