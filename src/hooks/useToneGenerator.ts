import { useRef, useCallback, useState } from 'react'

interface OscillatorSet {
  oscillators: OscillatorNode[]
  gainNode: GainNode
}

export function useToneGenerator() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const activeNodesRef = useRef<OscillatorSet | null>(null)
  const playingFrequencyRef = useRef<number | null>(null)
  const [playingFrequency, setPlayingFrequency] = useState<number | null>(null)

  const stopTone = useCallback(() => {
    if (activeNodesRef.current && audioContextRef.current) {
      const ctx = audioContextRef.current
      const { oscillators, gainNode } = activeNodesRef.current

      // Quick fade out
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05)

      setTimeout(() => {
        oscillators.forEach(osc => {
          try {
            osc.stop()
          } catch {
            // Already stopped
          }
        })
      }, 60)
    }
    activeNodesRef.current = null
    playingFrequencyRef.current = null
    setPlayingFrequency(null)
  }, [])

  const playTone = useCallback((frequency: number, isBass: boolean = false) => {
    // If already playing this frequency, stop it
    if (playingFrequencyRef.current === frequency) {
      stopTone()
      return
    }

    // Stop any existing tone
    stopTone()

    // Create or reuse audio context
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    // Create master gain node
    const masterGain = ctx.createGain()
    masterGain.connect(ctx.destination)

    // Harmonic structure for a plucked string sound
    // Each harmonic has: [harmonic number, relative amplitude, decay rate]
    const harmonics: [number, number, number][] = isBass
      ? [
          [1, 1.0, 0.8],    // Fundamental - strong, slow decay
          [2, 0.6, 1.2],    // 2nd harmonic
          [3, 0.4, 1.8],    // 3rd harmonic
          [4, 0.25, 2.2],   // 4th harmonic
          [5, 0.15, 2.8],   // 5th harmonic
        ]
      : [
          [1, 1.0, 1.5],    // Fundamental
          [2, 0.5, 2.0],    // 2nd harmonic (octave)
          [3, 0.35, 2.5],   // 3rd harmonic
          [4, 0.25, 3.0],   // 4th harmonic
          [5, 0.15, 3.5],   // 5th harmonic
          [6, 0.1, 4.0],    // 6th harmonic
          [7, 0.05, 4.5],   // 7th harmonic - subtle brightness
        ]

    const oscillators: OscillatorNode[] = []
    const duration = isBass ? 4.0 : 3.0 // Bass notes ring longer

    harmonics.forEach(([harmonic, amplitude, decayRate]) => {
      const harmonicFreq = frequency * harmonic

      // Skip harmonics above hearing range
      if (harmonicFreq > 16000) return

      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      // Use sine waves - the combination creates the timbre
      osc.type = 'sine'
      osc.frequency.setValueAtTime(harmonicFreq, now)

      // Pluck envelope: quick attack, exponential decay
      const baseVolume = 0.4 * amplitude
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(baseVolume, now + 0.003) // 3ms attack
      gainNode.gain.exponentialRampToValueAtTime(
        baseVolume * 0.3,
        now + (duration / decayRate)
      )
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration)

      osc.connect(gainNode)
      gainNode.connect(masterGain)

      osc.start(now)
      osc.stop(now + duration + 0.1)

      oscillators.push(osc)
    })

    // Add a subtle "pluck" transient using noise
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate)
    const noiseData = noiseBuffer.getChannelData(0)
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.3
    }

    const noiseSource = ctx.createBufferSource()
    noiseSource.buffer = noiseBuffer

    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.15, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.setValueAtTime(frequency * 2, now)
    noiseFilter.Q.setValueAtTime(1, now)

    noiseSource.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(masterGain)
    noiseSource.start(now)

    activeNodesRef.current = { oscillators, gainNode: masterGain }
    playingFrequencyRef.current = frequency
    setPlayingFrequency(frequency)

    // Auto-stop after duration
    setTimeout(() => {
      if (playingFrequencyRef.current === frequency) {
        activeNodesRef.current = null
        playingFrequencyRef.current = null
        setPlayingFrequency(null)
      }
    }, duration * 1000)
  }, [stopTone])

  return { playTone, stopTone, playingFrequency }
}
