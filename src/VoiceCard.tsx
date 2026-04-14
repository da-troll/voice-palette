import { useRef, useEffect, useState } from 'react';
import type { VoiceCard as VoiceCardType } from './types';

const COLOR_MAP: Record<string, { bg: string; border: string; badge: string; ring: string; icon: string }> = {
  blue:    { bg: 'bg-blue-950/40',   border: 'border-blue-700/50',   badge: 'bg-blue-900/60 text-blue-300',   ring: 'ring-blue-500',   icon: 'text-blue-400' },
  violet:  { bg: 'bg-violet-950/40', border: 'border-violet-700/50', badge: 'bg-violet-900/60 text-violet-300', ring: 'ring-violet-500', icon: 'text-violet-400' },
  amber:   { bg: 'bg-amber-950/40',  border: 'border-amber-700/50',  badge: 'bg-amber-900/60 text-amber-300',  ring: 'ring-amber-500',  icon: 'text-amber-400' },
  zinc:    { bg: 'bg-zinc-800/60',   border: 'border-zinc-600/50',   badge: 'bg-zinc-700/60 text-zinc-300',   ring: 'ring-zinc-400',   icon: 'text-zinc-400' },
  emerald: { bg: 'bg-emerald-950/40',border: 'border-emerald-700/50',badge: 'bg-emerald-900/60 text-emerald-300',ring: 'ring-emerald-500',icon: 'text-emerald-400' },
  rose:    { bg: 'bg-rose-950/40',   border: 'border-rose-700/50',   badge: 'bg-rose-900/60 text-rose-300',   ring: 'ring-rose-500',   icon: 'text-rose-400' },
};

const ICONS: Record<string, string> = {
  alloy:   '◈',
  echo:    '◎',
  fable:   '◇',
  onyx:    '▲',
  nova:    '✦',
  shimmer: '❋',
};

interface Props {
  card: VoiceCardType;
  onGenerate: () => void;
  onPlay: () => void;
  onStop: () => void;
  isActive: boolean;
}

export default function VoiceCard({ card, onGenerate, onPlay, onStop, isActive }: Props) {
  const { voice, state, audioUrl, error, duration } = card;
  const colors = COLOR_MAP[voice.color] ?? COLOR_MAP.blue;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    const handleEnded = () => onStop();
    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
      }
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [onStop]);

  useEffect(() => {
    if (!audioRef.current || !audioUrl) return;
    audioRef.current.src = audioUrl;
    audioRef.current.load();
  }, [audioUrl]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (state === 'playing') {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
      if (state === 'ready') {
        audioRef.current.currentTime = 0;
        setProgress(0);
        setCurrentTime(0);
      }
    }
  }, [state]);

  const isLoading = state === 'loading';
  const isPlaying = state === 'playing';
  const hasAudio = !!audioUrl;

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  return (
    <div
      className={`relative flex flex-col gap-3 rounded-xl border p-4 transition-all duration-200
        ${colors.bg} ${colors.border}
        ${isActive ? `ring-2 ${colors.ring} shadow-lg shadow-black/30` : ''}
        ${isPlaying ? 'scale-[1.01]' : ''}
      `}
    >
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className={`text-2xl leading-none ${colors.icon}`}>{ICONS[voice.id]}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">{voice.name}</h3>
              {isPlaying && (
                <span className="flex gap-[2px] items-end h-3">
                  {[1, 2, 3, 4].map(i => (
                    <span
                      key={i}
                      className={`w-[3px] rounded-full ${colors.icon} bg-current animate-pulse`}
                      style={{
                        height: `${6 + (i % 3) * 4}px`,
                        animationDelay: `${i * 100}ms`,
                        animationDuration: '600ms',
                      }}
                    />
                  ))}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400">{voice.persona}</p>
          </div>
        </div>
        {duration && !isPlaying && (
          <span className="text-[10px] text-zinc-500 tabular-nums">{formatTime(duration)}</span>
        )}
        {isPlaying && (
          <span className={`text-[10px] tabular-nums ${colors.icon}`}>
            {formatTime(currentTime)}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-zinc-400 leading-relaxed">{voice.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {voice.tags.map(tag => (
          <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full ${colors.badge}`}>
            {tag}
          </span>
        ))}
      </div>

      {/* Progress bar */}
      {isPlaying && (
        <div className="w-full h-0.5 bg-zinc-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-100 bg-current ${colors.icon}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-[11px] text-red-400 truncate">{error}</p>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={onGenerate}
          disabled={isLoading || isPlaying}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-all
            ${isLoading
              ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white cursor-pointer'
            }`}
        >
          {isLoading ? (
            <>
              <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating…
            </>
          ) : (
            <>
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.001z" />
              </svg>
              {hasAudio ? 'Regenerate' : 'Generate'}
            </>
          )}
        </button>

        {hasAudio && (
          <button
            onClick={isPlaying ? onStop : onPlay}
            disabled={isLoading}
            className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer
              ${isPlaying
                ? `bg-current/10 ${colors.icon} hover:bg-current/20`
                : `bg-zinc-700 text-white hover:bg-zinc-600`
              }`}
          >
            {isPlaying ? (
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
              </svg>
            ) : (
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
