export interface Voice {
  id: string;
  name: string;
  persona: string;
  description: string;
  tags: string[];
  color: string;
}

export type VoiceState = 'idle' | 'loading' | 'ready' | 'playing' | 'error';

export interface VoiceCard {
  voice: Voice;
  state: VoiceState;
  audioUrl: string | null;
  error: string | null;
  duration: number | null;
}
