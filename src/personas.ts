export interface Persona {
  id: string
  name: string
  emoji: string
  vibe: string
  color: string
  glowColor: string
  settings: {
    rate: number
    pitch: number
    volume: number
  }
}

export const PERSONAS: Persona[] = [
  {
    id: 'narrator',
    name: 'The Narrator',
    emoji: '🎙️',
    vibe: 'Slow, deep, measured — documentary voiceover energy',
    color: 'from-slate-700 to-slate-900',
    glowColor: 'shadow-slate-500/40',
    settings: { rate: 0.75, pitch: 0.7, volume: 1.0 },
  },
  {
    id: 'robot',
    name: 'The Robot',
    emoji: '🤖',
    vibe: 'Flat pitch, staccato cadence — emotionless precision',
    color: 'from-cyan-800 to-cyan-950',
    glowColor: 'shadow-cyan-400/40',
    settings: { rate: 0.9, pitch: 0.3, volume: 1.0 },
  },
  {
    id: 'auctioneer',
    name: 'The Auctioneer',
    emoji: '⚡',
    vibe: 'Fast rate, high energy — sold to the highest bidder',
    color: 'from-orange-700 to-orange-950',
    glowColor: 'shadow-orange-400/40',
    settings: { rate: 1.9, pitch: 1.2, volume: 1.0 },
  },
  {
    id: 'whisper',
    name: 'The Whisper',
    emoji: '🌙',
    vibe: 'Low volume, breathy — secrets and bedtime stories',
    color: 'from-indigo-800 to-indigo-950',
    glowColor: 'shadow-indigo-400/40',
    settings: { rate: 0.85, pitch: 1.0, volume: 0.25 },
  },
  {
    id: 'valley',
    name: 'The Valley Girl',
    emoji: '✨',
    vibe: 'High pitch, upbeat — like, totally excited about everything',
    color: 'from-pink-700 to-pink-950',
    glowColor: 'shadow-pink-400/40',
    settings: { rate: 1.15, pitch: 2.0, volume: 1.0 },
  },
]
