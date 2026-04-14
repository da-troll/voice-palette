# Plan: Voice Palette

**Inspired by:** OpenMOSS/MOSS-TTS-Nano (tiny TTS model, 663 stars)

## What does it do?
MOSS-TTS-Nano is a lightweight neural TTS model. The concept: high-quality text-to-speech in a tiny package. We take the *idea* (accessible TTS with character) and implement it entirely in-browser using the Web Speech API — no model weights, no backend, no keys.

## Where does it fit?
Standalone useful app — something Daniel would open to audition how text sounds, test copy phrasing, or just have fun with persona-based speech.

## Scoped MVP
- Large textarea for text input
- 5 persona cards, each with distinct SpeechSynthesis settings (rate/pitch/volume)
- Per-card Play/Stop button
- "Play All" sequencing with gaps between personas
- Active state: card highlights + sound wave animation
- Dark mode, clean minimal UI

## Build tasks
1. Scaffold Vite + React + TypeScript + Tailwind CSS
2. Define 5 persona configs (rate, pitch, volume)
3. `useSpeech` hook wrapping Web Speech API (speak, playAll, stop)
4. `VoicePalette` main component
5. `PersonaCard` sub-component with animation states
6. Build, deploy, gallery update
