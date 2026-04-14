# 🎨 Voice Palette

**Paste any text. Hear it in 5 distinct voices. Zero backend required.**

Live: https://mvp.trollefsen.com/2026-04-14-voice-palette/

---

## What it does

Voice Palette lets you paste any text and instantly hear it read back through 5 carefully tuned speech personas using the browser's built-in Web Speech API. No server. No API keys. No installs beyond a modern browser.

## The 5 Personas

| Persona | Vibe | Rate | Pitch |
|---------|------|------|-------|
| 🎙️ The Narrator | Slow, deep, measured — documentary voiceover | 0.75× | Low |
| 🤖 The Robot | Flat pitch, staccato cadence — emotionless | 0.9× | Very low |
| ⚡ The Auctioneer | Fast, high energy — sold! | 1.9× | High |
| 🌙 The Whisper | Low volume, breathy — secrets | 0.85× | Normal |
| ✨ The Valley Girl | Upbeat, high pitch — like, totally | 1.15× | Maximum |

## Features

- **Individual play** — click any card or its Play button to hear that persona
- **Play All** — sequences through all 5 personas with a gap between each
- **Stop** — kills speech instantly at any point
- **Live animation** — active card pulses with a sound wave indicator
- **Fully client-side** — zero backend, zero API keys, works offline

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Web Speech API (`window.speechSynthesis`)

## Run locally

```bash
git clone https://github.com/da-troll/voice-palette
cd voice-palette
npm install
npm run dev
```

## Browser support

Requires a browser with Web Speech API support. Chrome and Edge work best — voice quality varies by OS and browser.

---

*Built by the [Nightly MVP Builder](https://mvp.trollefsen.com) · 2026-04-14*
