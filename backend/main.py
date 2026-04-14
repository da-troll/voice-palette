import json
import os
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from openai import OpenAI
from pydantic import BaseModel, Field

# ── Config ──────────────────────────────────────────────────────────────────

HOUSEHOLD_JSON = Path("/home/eve/config/household.json")

def get_openai_key() -> str:
    with open(HOUSEHOLD_JSON) as f:
        cfg = json.load(f)
    key = cfg.get("skills", {}).get("apiKeys", {}).get("openai_whisper")
    if not key:
        raise RuntimeError("openai_whisper key not found in household.json")
    return key


VOICES = [
    {
        "id": "alloy",
        "name": "Alloy",
        "persona": "The Narrator",
        "description": "Neutral, clear, and authoritative. Versatile across all content types.",
        "tags": ["balanced", "clear", "versatile"],
        "color": "blue",
    },
    {
        "id": "echo",
        "name": "Echo",
        "persona": "The Broadcaster",
        "description": "Warm, resonant, and measured. Built for professional delivery.",
        "tags": ["warm", "resonant", "professional"],
        "color": "violet",
    },
    {
        "id": "fable",
        "name": "Fable",
        "persona": "The Storyteller",
        "description": "Expressive with a British warmth. Draws you in for the long haul.",
        "tags": ["expressive", "british", "engaging"],
        "color": "amber",
    },
    {
        "id": "onyx",
        "name": "Onyx",
        "persona": "The Authority",
        "description": "Deep, powerful, commanding. Every word lands with weight.",
        "tags": ["deep", "powerful", "dramatic"],
        "color": "zinc",
    },
    {
        "id": "nova",
        "name": "Nova",
        "persona": "The Guide",
        "description": "Bright, energetic, approachable. Perfect for instructional content.",
        "tags": ["bright", "energetic", "friendly"],
        "color": "emerald",
    },
    {
        "id": "shimmer",
        "name": "Shimmer",
        "persona": "The Empath",
        "description": "Soft, expressive, nuanced. Carries emotional depth in every line.",
        "tags": ["soft", "expressive", "emotive"],
        "color": "rose",
    },
]

VOICE_IDS = {v["id"] for v in VOICES}

# ── App ──────────────────────────────────────────────────────────────────────

app = FastAPI(title="Voice Palette API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Models ───────────────────────────────────────────────────────────────────

class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)
    voice: Literal["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
    model: Literal["tts-1", "tts-1-hd", "gpt-4o-mini-tts"] = "tts-1"
    speed: float = Field(default=1.0, ge=0.25, le=4.0)
    instructions: str | None = Field(default=None, max_length=500)

# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/api/voices")
def list_voices():
    return {"voices": VOICES}


@app.post("/api/tts")
async def text_to_speech(req: TTSRequest):
    if req.voice not in VOICE_IDS:
        raise HTTPException(status_code=400, detail=f"Unknown voice: {req.voice}")

    try:
        api_key = get_openai_key()
        client = OpenAI(api_key=api_key)
        kwargs: dict = dict(
            model=req.model,
            voice=req.voice,
            input=req.text,
            speed=req.speed,
            response_format="mp3",
        )
        if req.instructions and req.model == "gpt-4o-mini-tts":
            kwargs["instructions"] = req.instructions
        response = client.audio.speech.create(**kwargs)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    def audio_stream():
        yield from response.iter_bytes(chunk_size=4096)

    return StreamingResponse(
        audio_stream(),
        media_type="audio/mpeg",
        headers={
            "Content-Disposition": f'inline; filename="voice-{req.voice}.mp3"',
            "Cache-Control": "no-cache",
        },
    )


@app.get("/api/health")
def health():
    return {"status": "ok"}


# ── Static frontend ──────────────────────────────────────────────────────────
# Mounted last so API routes take precedence.
_static_dir = Path(__file__).parent.parent / "out"
if _static_dir.exists():
    app.mount("/", StaticFiles(directory=str(_static_dir), html=True), name="static")
