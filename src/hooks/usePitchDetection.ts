import { useState, useRef, useCallback, useEffect } from 'react'

interface PitchData {
  frequency: number
  note: string
  octave: number
  cents: number
  isPlaying: boolean
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const A4_FREQUENCY = 440

function frequencyToNote(frequency: number): { note: string; octave: number; cents: number } {
  const semitonesFromA4 = 12 * Math.log2(frequency / A4_FREQUENCY)
  const roundedSemitones = Math.round(semitonesFromA4)
  const cents = Math.round((semitonesFromA4 - roundedSemitones) * 100)

  const noteIndex = ((roundedSemitones % 12) + 12 + 9) % 12 // A is index 9
  const octave = Math.floor((roundedSemitones + 9) / 12) + 4

  return {
    note: NOTE_NAMES[noteIndex],
    octave,
    cents
  }
}

function autoCorrelate(buffer: Float32Array, sampleRate: number): number {
  const SIZE = buffer.length
  let rms = 0

  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i]
  }
  rms = Math.sqrt(rms / SIZE)

  if (rms < 0.01) return -1 // Not enough signal

  let r1 = 0, r2 = SIZE - 1
  const threshold = 0.2

  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) {
      r1 = i
      break
    }
  }

  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < threshold) {
      r2 = SIZE - i
      break
    }
  }

  const buf2 = buffer.slice(r1, r2)
  const c = new Array(buf2.length).fill(0)

  for (let i = 0; i < buf2.length; i++) {
    for (let j = 0; j < buf2.length - i; j++) {
      c[i] += buf2[j] * buf2[j + i]
    }
  }

  let d = 0
  while (c[d] > c[d + 1]) d++

  let maxVal = -1
  let maxPos = -1

  for (let i = d; i < buf2.length; i++) {
    if (c[i] > maxVal) {
      maxVal = c[i]
      maxPos = i
    }
  }

  let T0 = maxPos

  // Parabolic interpolation
  const x1 = c[T0 - 1] ?? 0
  const x2 = c[T0]
  const x3 = c[T0 + 1] ?? 0

  const a = (x1 + x3 - 2 * x2) / 2
  const b = (x3 - x1) / 2

  if (a) T0 = T0 - b / (2 * a)

  return sampleRate / T0
}

export function usePitchDetection() {
  const [pitchData, setPitchData] = useState<PitchData>({
    frequency: 0,
    note: '-',
    octave: 0,
    cents: 0,
    isPlaying: false
  })
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)

  const analyze = useCallback(() => {
    if (!analyserRef.current || !audioContextRef.current) return

    const analyser = analyserRef.current
    const buffer = new Float32Array(analyser.fftSize)
    analyser.getFloatTimeDomainData(buffer)

    const frequency = autoCorrelate(buffer, audioContextRef.current.sampleRate)

    if (frequency > 20 && frequency < 5000) {
      const { note, octave, cents } = frequencyToNote(frequency)
      setPitchData({
        frequency: Math.round(frequency * 10) / 10,
        note,
        octave,
        cents,
        isPlaying: true
      })
    } else {
      setPitchData(prev => ({ ...prev, isPlaying: false }))
    }

    rafRef.current = requestAnimationFrame(analyze)
  }, [])

  const startListening = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 2048

      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      setIsListening(true)
      analyze()
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access to use the tuner.')
      console.error('Error accessing microphone:', err)
    }
  }, [analyze])

  const stopListening = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    analyserRef.current = null
    setIsListening(false)
    setPitchData({
      frequency: 0,
      note: '-',
      octave: 0,
      cents: 0,
      isPlaying: false
    })
  }, [])

  useEffect(() => {
    return () => {
      stopListening()
    }
  }, [stopListening])

  return {
    pitchData,
    isListening,
    error,
    startListening,
    stopListening
  }
}
