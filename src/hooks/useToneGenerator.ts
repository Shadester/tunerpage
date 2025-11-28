import { useRef, useCallback, useState } from 'react'

export function useToneGenerator() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const [playingFrequency, setPlayingFrequency] = useState<number | null>(null)

  const playTone = useCallback((frequency: number) => {
    // If already playing this frequency, stop it
    if (playingFrequency === frequency) {
      stopTone()
      return
    }

    // Stop any existing tone
    if (oscillatorRef.current) {
      oscillatorRef.current.stop()
      oscillatorRef.current = null
    }

    // Create or reuse audio context
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }

    const ctx = audioContextRef.current

    // Create oscillator
    const oscillator = ctx.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

    // Create gain node for volume control and smooth start/stop
    const gainNode = ctx.createGain()
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05)

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.start()
    oscillatorRef.current = oscillator
    gainNodeRef.current = gainNode
    setPlayingFrequency(frequency)
  }, [playingFrequency])

  const stopTone = useCallback(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      const ctx = audioContextRef.current
      gainNodeRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05)

      setTimeout(() => {
        if (oscillatorRef.current) {
          oscillatorRef.current.stop()
          oscillatorRef.current = null
        }
        gainNodeRef.current = null
      }, 60)
    }
    setPlayingFrequency(null)
  }, [])

  return { playTone, stopTone, playingFrequency }
}
