# Voice Palette

**Compare all 6 OpenAI TTS voices side by side. Real neural TTS — no browser quirks.**

Live: https://mvp.trollefsen.com/2026-04-14-voice-palette/

---

## What it does

Voice Palette generates speech in all 6 OpenAI TTS voices simultaneously, so you can compare them directly on any input text. Pick a sample or type your own — then hit Generate All to hear how each voice handles it.

## The 6 Voices

| Voice | Persona | Character |
|-------|---------|-----------|
| Alloy | The Narrator | Neutral, clear, versatile |
| Echo | The Broadcaster | Warm, resonant, professional |
| Fable | The Storyteller | Expressive, British warmth |
| Onyx | The Authority | Deep, powerful, commanding |
| Nova | The Guide | Bright, energetic, approachable |
| Shimmer | The Empath | Soft, expressive, nuanced |

## Features

- **Generate All** — fires all 6 voices in parallel, audio appears as each loads
- **Per-voice generate** — regenerate individual voices without losing the others
- **Progress bar** — live playback position per voice card
- **Quality toggle** — Standard (`tts-1`) vs HD (`tts-1-hd`)
- **Sample texts** — 4 presets covering narration, announcements, technical, conversational
- **FastAPI backend** — real OpenAI TTS, not browser speech synthesis

## Tech Stack

- React 19 + TypeScript
- Vite + Tailwind CSS v4
- FastAPI + uvicorn
- OpenAI TTS API (`tts-1` / `tts-1-hd`)

## Run locally

```bash
git clone https://github.com/da-troll/voice-palette
cd voice-palette

# Backend
pip install fastapi uvicorn openai
# Set OPENAI_API_KEY or update backend/main.py
uvicorn backend.main:app --port 8000

# Frontend (dev mode, separate terminal)
npm install
npm run dev
```

## Browser support

Works in all modern browsers. Audio playback uses standard HTML5 `<audio>` — no browser TTS quirks.

---

*Built by the [Nightly MVP Builder](https://mvp.trollefsen.com) · 2026-04-14*
