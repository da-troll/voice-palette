import { useState, useCallback, useEffect } from 'react';
import type { Voice, VoiceCard } from './types';
import VoiceCardComponent from './VoiceCard';
import { generateSpeech, fetchVoices } from './api';

const SAMPLE_TEXTS = [
  {
    label: 'Narration',
    text: 'In the quiet hours before dawn, when the city holds its breath and the sky blushes with the faintest trace of light, there exists a moment of perfect stillness — brief, inevitable, and impossibly beautiful.',
  },
  {
    label: 'Announcement',
    text: 'Attention passengers: the 8:42 express to Central Station will be departing from Platform 3 in approximately five minutes. Please ensure all luggage is secured and move to the platform at your earliest convenience.',
  },
  {
    label: 'Technical',
    text: 'The transformer architecture relies on self-attention mechanisms to process sequential data in parallel — dramatically improving training efficiency over recurrent approaches.',
  },
  {
    label: 'Conversational',
    text: "Hey, so I've been thinking — what if we just build the thing first and figure out the design as we go? Shipping something imperfect is almost always better than shipping nothing at all.",
  },
];

export default function VoicePalette() {
  const [text, setText] = useState(SAMPLE_TEXTS[0].text);
  const [model, setModel] = useState<'tts-1' | 'tts-1-hd'>('tts-1');
  const [cards, setCards] = useState<VoiceCard[]>([]);
  const [activeVoice, setActiveVoice] = useState<string | null>(null);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [charCount, setCharCount] = useState(SAMPLE_TEXTS[0].text.length);

  useEffect(() => {
    fetchVoices().then((data: { voices: Voice[] }) => {
      setCards(
        data.voices.map(v => ({
          voice: v,
          state: 'idle' as const,
          audioUrl: null,
          error: null,
          duration: null,
        })),
      );
    });
  }, []);

  const updateCard = useCallback((voiceId: string, patch: Partial<VoiceCard>) => {
    setCards(prev => prev.map(c => c.voice.id === voiceId ? { ...c, ...patch } : c));
  }, []);

  const handleTextChange = (val: string) => {
    if (val.length <= 1000) {
      setText(val);
      setCharCount(val.length);
    }
  };

  const generateForVoice = useCallback(async (voiceId: string) => {
    if (!text.trim()) return;
    updateCard(voiceId, { state: 'loading', error: null });
    try {
      const url = await generateSpeech(text, voiceId, model);
      const audio = new Audio(url);
      await new Promise<void>((resolve) => {
        audio.addEventListener('loadedmetadata', () => resolve(), { once: true });
        audio.addEventListener('error', () => resolve(), { once: true });
      });
      updateCard(voiceId, {
        state: 'ready',
        audioUrl: url,
        duration: isFinite(audio.duration) ? audio.duration : null,
      });
    } catch (e) {
      updateCard(voiceId, { state: 'error', error: (e as Error).message });
    }
  }, [text, model, updateCard]);

  const handlePlay = useCallback((voiceId: string) => {
    if (activeVoice && activeVoice !== voiceId) {
      updateCard(activeVoice, { state: 'ready' });
    }
    setActiveVoice(voiceId);
    updateCard(voiceId, { state: 'playing' });
  }, [activeVoice, updateCard]);

  const handleStop = useCallback((voiceId: string) => {
    updateCard(voiceId, { state: 'ready' });
    if (activeVoice === voiceId) setActiveVoice(null);
  }, [activeVoice, updateCard]);

  const generateAll = useCallback(async () => {
    if (!text.trim() || generatingAll) return;
    setGeneratingAll(true);
    const voiceIds = cards.map(c => c.voice.id);
    await Promise.all(voiceIds.map(id => generateForVoice(id)));
    setGeneratingAll(false);
  }, [text, cards, generateForVoice, generatingAll]);

  const loadingCount = cards.filter(c => c.state === 'loading').length;
  const readyCount = cards.filter(c => c.state === 'ready' || c.state === 'playing').length;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">Voice Palette</h1>
            <p className="text-xs text-zinc-500 mt-0.5">OpenAI TTS · 6 voices side by side</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-zinc-500">Quality</label>
            <select
              value={model}
              onChange={e => setModel(e.target.value as 'tts-1' | 'tts-1-hd')}
              className="text-xs bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-zinc-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
              <option value="tts-1">Standard</option>
              <option value="tts-1-hd">HD</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Text input */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">Input text</label>
            <span className={`text-xs tabular-nums ${charCount > 900 ? 'text-amber-400' : 'text-zinc-500'}`}>
              {charCount}/1000
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SAMPLE_TEXTS.map(s => (
              <button
                key={s.label}
                onClick={() => handleTextChange(s.text)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer
                  ${text === s.text
                    ? 'bg-zinc-700 border-zinc-500 text-white'
                    : 'bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300'
                  }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <textarea
            value={text}
            onChange={e => handleTextChange(e.target.value)}
            rows={4}
            placeholder="Enter text to synthesize…"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent leading-relaxed"
          />
        </section>

        {/* Generate all */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-zinc-500">
            {readyCount > 0 && (
              <span>{readyCount} of {cards.length} voices ready</span>
            )}
          </div>
          <button
            onClick={generateAll}
            disabled={generatingAll || !text.trim()}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer
              ${generatingAll || !text.trim()
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-white text-zinc-950 hover:bg-zinc-100 shadow-sm'
              }`}
          >
            {generatingAll ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating {loadingCount} remaining…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Generate All 6 Voices
              </>
            )}
          </button>
        </div>

        {/* Voice cards grid */}
        {cards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map(card => (
              <VoiceCardComponent
                key={card.voice.id}
                card={card}
                isActive={activeVoice === card.voice.id || card.state === 'playing'}
                onGenerate={() => generateForVoice(card.voice.id)}
                onPlay={() => handlePlay(card.voice.id)}
                onStop={() => handleStop(card.voice.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-zinc-600 text-sm">
            Loading voices…
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-800 mt-12">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between text-xs text-zinc-600">
          <span>Voice Palette · Nightly MVP · 2026-04-14</span>
          <span>Powered by OpenAI TTS</span>
        </div>
      </footer>
    </div>
  );
}
