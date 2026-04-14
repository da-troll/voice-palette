// Derive API base from current page location — works whether served at / or /subpath/
const API_BASE = (() => {
  // In production, FastAPI serves both frontend and API, so we just need
  // the path up to and including the last segment that's our app root.
  // Since Caddy strips the prefix before forwarding, we go via the browser URL.
  // window.location.origin + pathname-up-to-app-root = where the app lives.
  // But since FastAPI handles /api/* at the same host:port as static files,
  // we can use a path relative to where the index.html was loaded from.
  const base = document.baseURI.replace(/\/[^/]*$/, '');
  return base;
})();

export async function generateSpeech(
  text: string,
  voiceId: string,
  model: 'tts-1' | 'tts-1-hd' = 'tts-1',
  speed: number = 1.0,
): Promise<string> {
  const res = await fetch(`${API_BASE}/api/tts`, {
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
  const res = await fetch(`${API_BASE}/api/voices`);
  if (!res.ok) throw new Error('Failed to fetch voices');
  return res.json();
}
