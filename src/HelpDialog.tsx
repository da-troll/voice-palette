interface Props {
  onClose: () => void;
}

export default function HelpDialog({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 rounded-t-2xl">
          <h2 className="text-sm font-bold text-white">Tips & Notation Guide</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 space-y-5 text-sm text-zinc-300">
          {/* Models section */}
          <section>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Models</h3>
            <div className="space-y-2">
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <div className="text-xs font-medium text-white">tts-1 (Standard)</div>
                <p className="text-xs text-zinc-400 mt-0.5">Optimized for low latency. Good for real-time or interactive use.</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <div className="text-xs font-medium text-white">tts-1-hd (HD)</div>
                <p className="text-xs text-zinc-400 mt-0.5">Higher audio quality at the cost of slightly more latency.</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white">gpt-4o-mini-tts (Mini TTS)</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300">Latest</span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Most capable model. Supports <strong className="text-zinc-200">voice instructions</strong> —
                  a free-form text prompt that controls emotion, tone, pacing, accent, and delivery style.
                </p>
              </div>
            </div>
          </section>

          {/* Voice instructions section */}
          <section>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Voice Instructions
              <span className="ml-1.5 text-[10px] font-normal text-zinc-600">gpt-4o-mini-tts only</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-2">
              Natural language prompt that controls how the voice sounds. Examples:
            </p>
            <div className="space-y-1.5">
              {[
                'Speak with urgency and excitement, like a sports commentator.',
                'Whisper softly, as if telling a secret at night.',
                'Read this like a calm, reassuring therapist.',
                'Adopt a formal British newsreader tone.',
                'Sound sarcastic and dry, with deadpan delivery.',
                'Speak slowly with dramatic pauses between sentences.',
              ].map(ex => (
                <div key={ex} className="text-xs text-zinc-500 bg-zinc-800/30 rounded px-2.5 py-1.5 font-mono">
                  {ex}
                </div>
              ))}
            </div>
          </section>

          {/* Inline notation section */}
          <section>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Inline Notation & Pause Control
            </h3>
            <p className="text-xs text-zinc-400 mb-2">
              OpenAI TTS does not support SSML tags. However, standard punctuation
              reliably affects pacing and pauses:
            </p>
            <div className="border border-zinc-800 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-zinc-800/60">
                    <th className="text-left px-3 py-2 text-zinc-400 font-medium">Character</th>
                    <th className="text-left px-3 py-2 text-zinc-400 font-medium">Effect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {[
                    [',', 'Short breath pause (~200ms)'],
                    ['.', 'Full stop pause (~400ms)'],
                    ['—', 'Natural mid-sentence break, longer than comma'],
                    ['...', 'Thoughtful / trailing pause with slight pitch drop'],
                    ['?', 'Rising intonation at end of phrase'],
                    ['!', 'Emphatic delivery, slightly louder'],
                    ['(parenthetical)', 'Often spoken at lower volume, like an aside'],
                    ['"quoted text"', 'May shift to a slightly different register'],
                  ].map(([char, effect]) => (
                    <tr key={char}>
                      <td className="px-3 py-2 font-mono text-zinc-200 whitespace-nowrap">{char}</td>
                      <td className="px-3 py-2 text-zinc-400">{effect}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-zinc-600 mt-2">
              Line breaks are generally collapsed to a space — use punctuation for reliable pauses.
              For fine-grained control, use <strong className="text-zinc-500">gpt-4o-mini-tts</strong> with
              voice instructions like "pause noticeably between paragraphs."
            </p>
          </section>

          {/* Speed section */}
          <section>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Speed</h3>
            <p className="text-xs text-zinc-400">
              Range: <span className="font-mono text-zinc-300">0.25x</span> to <span className="font-mono text-zinc-300">4.0x</span>.
              Default is <span className="font-mono text-zinc-300">1.0x</span>.
              Values below 0.5x and above 2.0x may degrade naturalness.
              Applies to all models.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
