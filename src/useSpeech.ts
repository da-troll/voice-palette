import { useCallback, useRef, useState } from 'react'
import type { Persona } from './personas'

export type PlayingState = { personaId: string; playing: true } | { personaId: null; playing: false }

export function useSpeech() {
  const [state, setState] = useState<PlayingState>({ personaId: null, playing: false })
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const playAllTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stop = useCallback(() => {
    if (playAllTimeoutRef.current) {
      clearTimeout(playAllTimeoutRef.current)
      playAllTimeoutRef.current = null
    }
    window.speechSynthesis.cancel()
    utteranceRef.current = null
    setState({ personaId: null, playing: false })
  }, [])

  const speak = useCallback((text: string, persona: Persona): Promise<void> => {
    return new Promise((resolve) => {
      window.speechSynthesis.cancel()
      if (!text.trim()) {
        resolve()
        return
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = persona.settings.rate
      utterance.pitch = persona.settings.pitch
      utterance.volume = persona.settings.volume

      utterance.onstart = () => {
        setState({ personaId: persona.id, playing: true })
      }

      utterance.onend = () => {
        setState({ personaId: null, playing: false })
        resolve()
      }

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted') {
          setState({ personaId: null, playing: false })
        }
        resolve()
      }

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    })
  }, [])

  const playPersona = useCallback((text: string, persona: Persona) => {
    if (playAllTimeoutRef.current) {
      clearTimeout(playAllTimeoutRef.current)
      playAllTimeoutRef.current = null
    }
    speak(text, persona)
  }, [speak])

  const playAll = useCallback(async (text: string, personas: Persona[]) => {
    if (!text.trim()) return
    stop()

    for (const persona of personas) {
      // Check if stopped mid-sequence
      if (playAllTimeoutRef.current === null && persona !== personas[0]) break

      await new Promise<void>((res) => {
        playAllTimeoutRef.current = setTimeout(res, 0)
      })

      const stillRunning = await new Promise<boolean>((res) => {
        if (playAllTimeoutRef.current === null) { res(false); return }
        speak(text, persona).then(() => res(true))
      })

      if (!stillRunning) break

      // Pause between personas
      if (persona !== personas[personas.length - 1]) {
        await new Promise<void>((res) => {
          playAllTimeoutRef.current = setTimeout(res, 700)
        })
      }
    }

    playAllTimeoutRef.current = null
    setState({ personaId: null, playing: false })
  }, [speak, stop])

  return { state, speak: playPersona, playAll, stop }
}
