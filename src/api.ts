export async function generateSpeech(
  text: string,
  voiceId: string,
  model: 'tts-1' | 'tts-1-hd' = 'tts-1',
  speed: number = 1.0,
): Promise<string> {
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice: voiceId, model, speed }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'TTS generation failed');
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

export async function fetchVoices() {
  const res = await fetch('/api/voices');
  if (!res.ok) throw new Error('Failed to fetch voices');
  return res.json();
}
