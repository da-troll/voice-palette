import { useState, useEffect } from 'react'
import { PERSONAS } from './personas'
import { useSpeech } from './useSpeech'

const DEFAULT_TEXT = `In a world where every voice tells a different story, the words remain the same — only the soul behind them changes. Listen carefully. Which one speaks to you?`

function SoundWave({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-[3px] h-5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full transition-all duration-150 ${
            active
              ? 'bg-white animate-pulse'
              : 'bg-white/30'
          }`}
          style={{
            height: active ? `${8 + ((i * 7) % 12)}px` : '4px',
            animationDelay: `${i * 80}ms`,
            animationDuration: `${400 + i * 60}ms`,
          }}
        />
      ))}
    </div>
  )
}

export default function VoicePalette() {
  const [text, setText] = useState(DEFAULT_TEXT)
  const [supported, setSupported] = useState(true)
  const { state, speak, playAll, stop } = useSpeech()
  const isPlaying = state.playing

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSupported(false)
    }
  }, [])

  const handlePlayPersona = (personaId: string) => {
    const persona = PERSONAS.find((p) => p.id === personaId)!
    if (state.playing && state.personaId === personaId) {
      stop()
    } else {
      speak(text, persona)
    }
  }

  const handlePlayAll = () => {
    if (isPlaying) {
      stop()
    } else {
      playAll(text, PERSONAS)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎨</span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Voice Palette</h1>
              <p className="text-xs text-gray-500">5 personas. One text. Endless character.</p>
            </div>
          </div>
          <span className="text-xs text-gray-600 hidden sm:block">Powered by Web Speech API</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 flex flex-col gap-8">
        {!supported && (
          <div className="bg-red-950/50 border border-red-800 rounded-xl p-4 text-red-300 text-sm">
            ⚠️ Your browser doesn't support the Web Speech API. Try Chrome or Edge.
          </div>
        )}

        {/* Text input */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            Your text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type anything here..."
            rows={4}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 resize-y focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 text-base leading-relaxed transition-colors"
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">{text.length} characters</span>
            <button
              onClick={() => setText('')}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Play All button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handlePlayAll}
            disabled={!supported || !text.trim()}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
              isPlaying
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/30'
                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50'
            }`}
          >
            {isPlaying ? (
              <>
                <span>⏹</span>
                Stop
              </>
            ) : (
              <>
                <span>▶</span>
                Play All Personas
              </>
            )}
          </button>
          {isPlaying && state.personaId && (
            <span className="text-sm text-gray-400">
              Playing: <span className="text-violet-400 font-medium">
                {PERSONAS.find((p) => p.id === state.personaId)?.name}
              </span>
            </span>
          )}
        </div>

        {/* Persona cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PERSONAS.map((persona) => {
            const isActive = state.playing && state.personaId === persona.id
            return (
              <div
                key={persona.id}
                className={`relative rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 cursor-pointer select-none
                  bg-gradient-to-br ${persona.color}
                  border ${isActive ? 'border-white/30' : 'border-white/10'}
                  ${isActive ? `shadow-xl ${persona.glowColor} shadow-lg scale-[1.02]` : 'hover:scale-[1.01] hover:border-white/20'}
                `}
                onClick={() => handlePlayPersona(persona.id)}
              >
                {/* Active pulse ring */}
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl animate-ping border border-white/20 pointer-events-none" />
                )}

                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-2xl">{persona.emoji}</span>
                    <h2 className="text-lg font-bold text-white tracking-tight">{persona.name}</h2>
                  </div>
                  <SoundWave active={isActive} />
                </div>

                <p className="text-sm text-white/60 leading-relaxed">{persona.vibe}</p>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePlayPersona(persona.id) }}
                    disabled={!supported || !text.trim()}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                      ${isActive
                        ? 'bg-white/20 hover:bg-white/30 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
                      }`}
                  >
                    {isActive ? <>⏹ Stop</> : <>▶ Play</>}
                  </button>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">rate</span>
                    <span className="text-xs text-white/60 font-mono">{persona.settings.rate}×</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Info strip */}
        <div className="border-t border-gray-800 pt-6 grid grid-cols-3 gap-4 text-center">
          {[
            { label: 'Personas', value: '5' },
            { label: 'Backend', value: 'None' },
            { label: 'API Keys', value: '0' },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-violet-400">{value}</span>
              <span className="text-xs text-gray-600 uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-gray-800 px-6 py-4 text-center text-xs text-gray-700">
        Built by the Nightly MVP Builder · {new Date().getFullYear()}
      </footer>
    </div>
  )
}
