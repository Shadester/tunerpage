import { useState, useEffect, useRef } from 'react'
import { usePitchDetection } from '../hooks/usePitchDetection'
import { useToneGenerator } from '../hooks/useToneGenerator'
import StrobeTuner from './StrobeTuner'
import './Tuner.css'

type InstrumentType = 'guitar' | 'bass4' | 'bass5'

interface StringNote {
  note: string
  octave: number
  freq: number
  string: number
}

interface Tuning {
  name: string
  strings: StringNote[]
}

const GUITAR_TUNINGS: Tuning[] = [
  {
    name: 'Standard (E A D G B E)',
    strings: [
      { note: 'E', octave: 2, freq: 82.41, string: 1 },
      { note: 'A', octave: 2, freq: 110.0, string: 2 },
      { note: 'D', octave: 3, freq: 146.83, string: 3 },
      { note: 'G', octave: 3, freq: 196.0, string: 4 },
      { note: 'B', octave: 3, freq: 246.94, string: 5 },
      { note: 'E', octave: 4, freq: 329.63, string: 6 }
    ]
  },
  {
    name: 'Drop D (D A D G B E)',
    strings: [
      { note: 'D', octave: 2, freq: 73.42, string: 1 },
      { note: 'A', octave: 2, freq: 110.0, string: 2 },
      { note: 'D', octave: 3, freq: 146.83, string: 3 },
      { note: 'G', octave: 3, freq: 196.0, string: 4 },
      { note: 'B', octave: 3, freq: 246.94, string: 5 },
      { note: 'E', octave: 4, freq: 329.63, string: 6 }
    ]
  },
  {
    name: 'Half Step Down (Eb Ab Db Gb Bb Eb)',
    strings: [
      { note: 'Eb', octave: 2, freq: 77.78, string: 1 },
      { note: 'Ab', octave: 2, freq: 103.83, string: 2 },
      { note: 'Db', octave: 3, freq: 138.59, string: 3 },
      { note: 'Gb', octave: 3, freq: 185.0, string: 4 },
      { note: 'Bb', octave: 3, freq: 233.08, string: 5 },
      { note: 'Eb', octave: 4, freq: 311.13, string: 6 }
    ]
  },
  {
    name: 'Whole Step Down (D G C F A D)',
    strings: [
      { note: 'D', octave: 2, freq: 73.42, string: 1 },
      { note: 'G', octave: 2, freq: 98.0, string: 2 },
      { note: 'C', octave: 3, freq: 130.81, string: 3 },
      { note: 'F', octave: 3, freq: 174.61, string: 4 },
      { note: 'A', octave: 3, freq: 220.0, string: 5 },
      { note: 'D', octave: 4, freq: 293.66, string: 6 }
    ]
  },
  {
    name: 'DADGAD',
    strings: [
      { note: 'D', octave: 2, freq: 73.42, string: 1 },
      { note: 'A', octave: 2, freq: 110.0, string: 2 },
      { note: 'D', octave: 3, freq: 146.83, string: 3 },
      { note: 'G', octave: 3, freq: 196.0, string: 4 },
      { note: 'A', octave: 3, freq: 220.0, string: 5 },
      { note: 'D', octave: 4, freq: 293.66, string: 6 }
    ]
  },
  {
    name: 'Open G (D G D G B D)',
    strings: [
      { note: 'D', octave: 2, freq: 73.42, string: 1 },
      { note: 'G', octave: 2, freq: 98.0, string: 2 },
      { note: 'D', octave: 3, freq: 146.83, string: 3 },
      { note: 'G', octave: 3, freq: 196.0, string: 4 },
      { note: 'B', octave: 3, freq: 246.94, string: 5 },
      { note: 'D', octave: 4, freq: 293.66, string: 6 }
    ]
  }
]

const BASS_TUNINGS: Record<string, Tuning[]> = {
  bass4: [
    {
      name: 'Standard (E A D G)',
      strings: [
        { note: 'E', octave: 1, freq: 41.2, string: 1 },
        { note: 'A', octave: 1, freq: 55.0, string: 2 },
        { note: 'D', octave: 2, freq: 73.42, string: 3 },
        { note: 'G', octave: 2, freq: 98.0, string: 4 }
      ]
    },
    {
      name: 'Drop D (D A D G)',
      strings: [
        { note: 'D', octave: 1, freq: 36.71, string: 1 },
        { note: 'A', octave: 1, freq: 55.0, string: 2 },
        { note: 'D', octave: 2, freq: 73.42, string: 3 },
        { note: 'G', octave: 2, freq: 98.0, string: 4 }
      ]
    },
    {
      name: 'Half Step Down (Eb Ab Db Gb)',
      strings: [
        { note: 'Eb', octave: 1, freq: 38.89, string: 1 },
        { note: 'Ab', octave: 1, freq: 51.91, string: 2 },
        { note: 'Db', octave: 2, freq: 69.30, string: 3 },
        { note: 'Gb', octave: 2, freq: 92.50, string: 4 }
      ]
    }
  ],
  bass5: [
    {
      name: 'Standard (B E A D G)',
      strings: [
        { note: 'B', octave: 0, freq: 30.87, string: 1 },
        { note: 'E', octave: 1, freq: 41.2, string: 2 },
        { note: 'A', octave: 1, freq: 55.0, string: 3 },
        { note: 'D', octave: 2, freq: 73.42, string: 4 },
        { note: 'G', octave: 2, freq: 98.0, string: 5 }
      ]
    },
    {
      name: 'Half Step Down (Bb Eb Ab Db Gb)',
      strings: [
        { note: 'Bb', octave: 0, freq: 29.14, string: 1 },
        { note: 'Eb', octave: 1, freq: 38.89, string: 2 },
        { note: 'Ab', octave: 1, freq: 51.91, string: 3 },
        { note: 'Db', octave: 2, freq: 69.30, string: 4 },
        { note: 'Gb', octave: 2, freq: 92.50, string: 5 }
      ]
    }
  ]
}

export default function Tuner() {
  const { pitchData, isListening, error, startListening, stopListening } = usePitchDetection()
  const { playTone, playingFrequency } = useToneGenerator()

  // Guided tuning mode state
  const [instrumentType, setInstrumentType] = useState<InstrumentType>('guitar')
  const [tuningIndex, setTuningIndex] = useState(0)
  const [currentStringIndex, setCurrentStringIndex] = useState(0)
  const [completedStrings, setCompletedStrings] = useState<boolean[]>([])
  const [inTuneCounter, setInTuneCounter] = useState(0)
  const inTuneTimerRef = useRef<number | null>(null)

  // Strobe tuner mode
  const [strobeMode, setStrobeMode] = useState(false)

  const getCentsIndicator = (cents: number) => {
    const position = Math.max(-50, Math.min(50, cents))
    const percentage = ((position + 50) / 100) * 100
    return percentage
  }

  const getTuningStatus = (cents: number) => {
    if (Math.abs(cents) <= 5) return 'in-tune'
    if (cents < 0) return 'flat'
    return 'sharp'
  }

  // Get the current tuning based on instrument type
  const getCurrentTuning = (): Tuning => {
    if (instrumentType === 'guitar') return GUITAR_TUNINGS[tuningIndex]
    if (instrumentType === 'bass4') return BASS_TUNINGS.bass4[tuningIndex]
    return BASS_TUNINGS.bass5[tuningIndex]
  }

  // Get available tunings for current instrument
  const getAvailableTunings = (): Tuning[] => {
    if (instrumentType === 'guitar') return GUITAR_TUNINGS
    if (instrumentType === 'bass4') return BASS_TUNINGS.bass4
    return BASS_TUNINGS.bass5
  }

  // Initialize completed strings array when tuning changes
  useEffect(() => {
    const tuning = getCurrentTuning()
    setCompletedStrings(new Array(tuning.strings.length).fill(false))
    setCurrentStringIndex(0)
  }, [instrumentType, tuningIndex])

  // Get current target string
  const currentTuning = getCurrentTuning()
  const targetString = currentTuning.strings[currentStringIndex]
  const isBass = instrumentType !== 'guitar'

  // Check if detected note matches target string
  const isMatchingNote = pitchData.note === targetString.note && pitchData.octave === targetString.octave

  // Auto-advance when in tune
  useEffect(() => {
    if (!isListening || !isMatchingNote) {
      setInTuneCounter(0)
      if (inTuneTimerRef.current) {
        clearTimeout(inTuneTimerRef.current)
        inTuneTimerRef.current = null
      }
      return
    }

    const status = getTuningStatus(pitchData.cents)
    if (status === 'in-tune' && pitchData.isPlaying) {
      setInTuneCounter(prev => prev + 1)

      // If in tune for 20 consecutive checks (~2 seconds at typical update rate)
      if (inTuneCounter >= 19) {
        // Mark current string as complete
        const newCompleted = [...completedStrings]
        newCompleted[currentStringIndex] = true
        setCompletedStrings(newCompleted)

        // Move to next string if available
        if (currentStringIndex < currentTuning.strings.length - 1) {
          setCurrentStringIndex(prev => prev + 1)
        }

        setInTuneCounter(0)
      }
    } else {
      setInTuneCounter(0)
    }
  }, [pitchData, isListening, isMatchingNote, currentStringIndex, completedStrings, inTuneCounter])

  const allStringsComplete = completedStrings.every(complete => complete)

  return (
    <div className="tuner">
      {error && <div className="error">{error}</div>}

      {/* Instrument & Tuning Selection */}
      <div className="guided-tuning-setup">
        <div className="instrument-selector">
          <h3>Instrument</h3>
          <div className="instrument-buttons">
            <button
              className={`instrument-button ${instrumentType === 'guitar' ? 'active' : ''}`}
              onClick={() => setInstrumentType('guitar')}
            >
              Guitar
            </button>
            <button
              className={`instrument-button ${instrumentType === 'bass4' ? 'active' : ''}`}
              onClick={() => setInstrumentType('bass4')}
            >
              Bass 4-String
            </button>
            <button
              className={`instrument-button ${instrumentType === 'bass5' ? 'active' : ''}`}
              onClick={() => setInstrumentType('bass5')}
            >
              Bass 5-String
            </button>
          </div>
        </div>

        <div className="tuning-selection">
          <h3>Tuning</h3>
          <select
            className="tuning-selector"
            value={tuningIndex}
            onChange={(e) => setTuningIndex(Number(e.target.value))}
          >
            {getAvailableTunings().map((tuning, i) => (
              <option key={i} value={i}>{tuning.name}</option>
            ))}
          </select>
        </div>

        <div className="display-mode-selector">
          <h3>Display Mode</h3>
          <div className="mode-buttons">
            <button
              className={`mode-button ${!strobeMode ? 'active' : ''}`}
              onClick={() => setStrobeMode(false)}
            >
              Standard
            </button>
            <button
              className={`mode-button ${strobeMode ? 'active' : ''}`}
              onClick={() => setStrobeMode(true)}
            >
              Strobe
            </button>
          </div>
        </div>
      </div>

      {/* Current Target String Display */}
      <div className="target-string-display">
        <div className="target-label">Target Note</div>
        <div className="target-note">
          {targetString.note}<span className="target-octave">{targetString.octave}</span>
        </div>
        <div className="target-frequency">{targetString.freq} Hz</div>
        <button
          className="play-reference-button"
          onClick={() => playTone(targetString.freq, isBass)}
        >
          {playingFrequency === targetString.freq ? '♪ Playing' : 'Play Reference Tone'}
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="string-progress">
        {currentTuning.strings.map((str, idx) => (
          <div
            key={idx}
            className={`progress-string ${idx === currentStringIndex ? 'current' : ''} ${completedStrings[idx] ? 'complete' : ''}`}
          >
            <div className="progress-string-note">{str.note}</div>
            {completedStrings[idx] && <div className="progress-check">✓</div>}
          </div>
        ))}
      </div>

      {allStringsComplete && (
        <div className="tuning-complete-message">
          All strings tuned! 🎉
        </div>
      )}

      {/* Tuner Display */}
      {strobeMode ? (
        <>
          {pitchData.isPlaying && isMatchingNote ? (
            <StrobeTuner cents={pitchData.cents} isPlaying={pitchData.isPlaying} />
          ) : (
            <div className="tuner-display">
              <div className={`note-display ${pitchData.isPlaying ? 'wrong-note' : pitchData.note !== '-' ? 'faded' : ''}`}>
                <span className="note">{pitchData.note !== '-' ? pitchData.note : 'Play a note...'}</span>
                <span className="octave">{pitchData.octave > 0 ? pitchData.octave : ''}</span>
              </div>
              {pitchData.note !== '-' && (
                <div className="frequency">
                  {pitchData.frequency} Hz
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="tuner-display">
          <div className={`note-display ${pitchData.isPlaying ? (isMatchingNote ? 'active' : 'wrong-note') : pitchData.note !== '-' ? 'faded' : ''}`}>
            <span className="note">{pitchData.note}</span>
            <span className="octave">{pitchData.octave > 0 ? pitchData.octave : ''}</span>
          </div>

          <div className="frequency">
            {pitchData.isPlaying
              ? `${pitchData.frequency} Hz`
              : pitchData.note !== '-'
                ? `${pitchData.frequency} Hz`
                : 'Play a note...'}
          </div>

          {isMatchingNote && (
            <div className="cents-meter">
              <div className="cents-scale">
                <span>-50</span>
                <span>0</span>
                <span>+50</span>
              </div>
              <div className="cents-bar">
                <div className="cents-center" />
                <div
                  className={`cents-indicator ${pitchData.isPlaying ? getTuningStatus(pitchData.cents) : ''}`}
                  style={{ left: `${getCentsIndicator(pitchData.cents)}%` }}
                />
              </div>
              <div className="cents-value">
                {(pitchData.isPlaying || pitchData.note !== '-') && (
                  <>
                    {pitchData.cents > 0 ? '+' : ''}{pitchData.cents} cents
                    <span className={`status ${pitchData.isPlaying ? getTuningStatus(pitchData.cents) : 'faded'}`}>
                      {getTuningStatus(pitchData.cents) === 'in-tune' ? '✓ In Tune' :
                       getTuningStatus(pitchData.cents) === 'flat' ? '↓ Flat' : '↑ Sharp'}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <button
        className={`listen-button ${isListening ? 'listening' : ''}`}
        onClick={isListening ? stopListening : startListening}
      >
        {isListening ? 'Stop Tuner' : 'Start Tuner'}
      </button>
    </div>
  )
}
