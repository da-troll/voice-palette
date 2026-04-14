const API_BASE = (() => {
  const base = document.baseURI.replace(/\/[^/]*$/, '');
  return base;
})();

export type TTSModel = 'tts-1' | 'tts-1-hd' | 'gpt-4o-mini-tts';

export interface TTSParams {
  text: string;
  voiceId: string;
  model?: TTSModel;
  speed?: number;
  instructions?: string;
}

export async function generateSpeech({
  text,
  voiceId,
  model = 'tts-1',
  speed = 1.0,
  instructions,
}: TTSParams): Promise<string> {
  const body: Record<string, unknown> = { text, voice: voiceId, model, speed };
  if (instructions && model === 'gpt-4o-mini-tts') {
    body.instructions = instructions;
  }

  const res = await fetch(`${API_BASE}/api/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'TTS generation failed');
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

export async function fetchVoices() {
  const res = await fetch(`${API_BASE}/api/voices`);
  if (!res.ok) throw new Error('Failed to fetch voices');
  return res.json();
}
