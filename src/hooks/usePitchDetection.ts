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

  // Threshold to filter out noise but keep guitar signal
  if (rms < 0.003) return -1

  // Normalize buffer for better peak detection
  const normalizedBuffer = new Float32Array(SIZE)
  for (let i = 0; i < SIZE; i++) {
    normalizedBuffer[i] = buffer[i] / rms
  }

  // Autocorrelation
  const c = new Array(SIZE).fill(0)
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE - i; j++) {
      c[i] += normalizedBuffer[j] * normalizedBuffer[j + i]
    }
  }

  // Normalize autocorrelation
  for (let i = 0; i < SIZE; i++) {
    c[i] = c[i] / c[0]
  }

  // Find first dip below 0
  let d = 0
  while (d < SIZE - 1 && c[d] > 0) d++

  // Find first peak after the dip with better threshold
  // Use 0.9 * first peak as recommended threshold
  let maxPos = -1
  const MIN_PERIOD = Math.floor(sampleRate / 1000) // 1000 Hz max
  const MAX_PERIOD = Math.floor(sampleRate / 70)   // 70 Hz min (lowest bass note is ~30Hz B0, but filter out footsteps/noise)

  // First pass: find the absolute maximum in valid range
  let absMax = -1
  for (let i = Math.max(d, MIN_PERIOD); i < Math.min(SIZE, MAX_PERIOD); i++) {
    if (c[i] > absMax) {
      absMax = c[i]
    }
  }

  // Second pass: find first peak above threshold (0.9 * absMax)
  const threshold = 0.9 * absMax
  for (let i = Math.max(d, MIN_PERIOD); i < Math.min(SIZE, MAX_PERIOD); i++) {
    if (c[i] > threshold && c[i] > c[i - 1] && c[i] > c[i + 1]) {
      maxPos = i
      break
    }
  }

  if (maxPos === -1) return -1

  let T0 = maxPos

  // Parabolic interpolation for sub-sample accuracy
  const x1 = c[T0 - 1] ?? 0
  const x2 = c[T0]
  const x3 = c[T0 + 1] ?? 0

  const a = (x1 + x3 - 2 * x2) / 2
  const b = (x3 - x1) / 2

  if (a !== 0) {
    T0 = T0 - b / (2 * a)
  }

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

      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Microphone access is not supported in this browser.')
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 48000 // Explicitly request 48kHz for better resolution
        }
      })
      streamRef.current = stream

      audioContextRef.current = new AudioContext({ sampleRate: 48000 })

      // Resume audio context if suspended (required by some browsers)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }

      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 8192 // Larger for better low frequency detection (8192 is good balance)
      analyserRef.current.smoothingTimeConstant = 0.3 // Moderate smoothing for balance between responsiveness and stability

      const source = audioContextRef.current.createMediaStreamSource(stream)

      // Add high-pass filter to remove footsteps, HVAC, and other low-frequency noise
      const highPassFilter = audioContextRef.current.createBiquadFilter()
      highPassFilter.type = 'highpass'
      highPassFilter.frequency.value = 60 // Cut off below 60Hz to eliminate noise while preserving lowest bass notes
      highPassFilter.Q.value = 0.7 // Gentle rolloff

      source.connect(highPassFilter)
      highPassFilter.connect(analyserRef.current)

      setIsListening(true)
      analyze()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(`Microphone access denied: ${errorMessage}`)
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
      // Cleanup on unmount
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return {
    pitchData,
    isListening,
    error,
    startListening,
    stopListening
  }
}
