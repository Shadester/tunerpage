import { useState, type ReactNode } from 'react'
import './RestringGuide.css'
import {
  StringWindingIllustration,
  StringSlackIllustration,
  BridgePinIllustration,
  ThroughBodyIllustration,
  StretchingIllustration,
  FloydRoseBlockIllustration,
  LockingNutIllustration,
  BassStringCutIllustration
} from './illustrations'

type InstrumentType = 'guitar' | 'bass'
type BridgeType = 'hardtail' | 'tremolo' | 'floyd'

interface Step {
  title: string
  description: string
  tip?: string
  illustration?: ReactNode
}

const GUITAR_STEPS: Step[] = [
  {
    title: '1. Prepare your workspace',
    description: 'Lay the guitar on a stable, padded surface. Have your new strings, wire cutters, string winder, and tuner ready.',
    tip: 'A neck rest or rolled-up towel under the neck prevents it from moving.'
  },
  {
    title: '2. Loosen and remove old strings',
    description: 'Detune each string completely by turning the tuning pegs. Once slack, unwind from the tuning peg and remove from the bridge.',
    tip: 'Remove strings one at a time to maintain neck tension, or all at once if you want to clean the fretboard.'
  },
  {
    title: '3. Clean the fretboard',
    description: 'With strings off, wipe down the fretboard with a dry cloth. For deeper cleaning, use lemon oil on rosewood/ebony (not maple).',
    tip: 'This is the perfect time to condition the wood and clean hard-to-reach areas.'
  },
  {
    title: '4. Thread the new string',
    description: 'Insert the ball end into the bridge (or through the body for string-through designs). Pull the string up to the tuning peg.',
    tip: 'Make sure the ball end is seated properly in the bridge.',
    illustration: <BridgePinIllustration />
  },
  {
    title: '5. Measure slack for winding',
    description: 'Pull the string taut, then add 2-3 inches of slack (about 2-3 tuning posts worth). This gives enough length for proper wraps.',
    tip: 'Too few wraps = string slippage. Too many = tuning instability.',
    illustration: <StringSlackIllustration />
  },
  {
    title: '6. Wind the string',
    description: 'Insert the string through the peg hole. Wind so the string wraps downward on the post, creating a break angle at the nut.',
    tip: 'First wrap should go above the string end, subsequent wraps below. Aim for 2-4 wraps total.',
    illustration: <StringWindingIllustration />
  },
  {
    title: '7. Stretch and tune',
    description: 'Bring the string up to pitch. Gently pull the string away from the fretboard at various points, then retune. Repeat until stable.',
    tip: 'New strings stretch! Plan to retune several times in the first few hours of playing.',
    illustration: <StretchingIllustration />
  },
  {
    title: '8. Trim excess',
    description: 'Once the string is stable, trim the excess wire close to the tuning peg with wire cutters.',
    tip: 'Leave a small amount to prevent the string from slipping through.'
  },
  {
    title: '9. Repeat for remaining strings',
    description: 'Follow the same process for each string, working from low to high (or vice versa).',
  },
  {
    title: '10. Final tuning check',
    description: 'After all strings are on, do a complete tuning pass. Check intonation by comparing the 12th fret harmonic to the fretted note.',
    tip: 'Intonation adjustments may be needed after changing string gauge.'
  }
]

const BASS_STEPS: Step[] = [
  {
    title: '1. Prepare your workspace',
    description: 'Place the bass on a stable, padded surface. Bass strings are thicker and under more tension - work carefully.',
    tip: 'A proper bass stand or neck rest is especially important due to the weight.'
  },
  {
    title: '2. Loosen and remove old strings',
    description: 'Detune each string fully. Bass strings have high tension - release slowly. Unwind from tuners and remove from bridge.',
    tip: 'Bass strings release a lot of tension. Go slowly to avoid sudden snaps.'
  },
  {
    title: '3. Clean the fretboard',
    description: 'Wipe down with a dry cloth. Condition rosewood/ebony with appropriate fretboard oil. Clean the frets with fine steel wool if needed.',
    tip: 'Tape off the pickups when using steel wool to prevent metal particles from sticking to magnets.'
  },
  {
    title: '4. Thread the new string',
    description: 'For through-body: feed from the back. For top-load: insert ball end into bridge. Guide the string up to the tuner.',
    tip: 'Bass strings are thick - make sure they seat properly in the bridge saddle.',
    illustration: <ThroughBodyIllustration />
  },
  {
    title: '5. Measure and cut',
    description: 'Extend the string past the target tuning peg, measure 3-4 inches past, and cut. Bass strings often need to be trimmed before winding.',
    tip: 'Bass strings are too thick to wind with excess - measure carefully before cutting!',
    illustration: <BassStringCutIllustration />
  },
  {
    title: '6. Wind the string',
    description: 'Insert the cut end into the tuner post hole. Wind so the string wraps downward. Aim for 2-3 clean wraps on bass tuners.',
    tip: 'Maintain tension while winding to ensure tight, even wraps.',
    illustration: <StringWindingIllustration />
  },
  {
    title: '7. Stretch and tune',
    description: 'Tune to pitch, then firmly (but gently) pull the string away from the fretboard. Retune and repeat until stable.',
    tip: 'Bass strings take longer to settle - be patient with the stretching process.',
    illustration: <StretchingIllustration />
  },
  {
    title: '8. Repeat for all strings',
    description: 'Complete the same process for each string. Work methodically from lowest to highest.',
  },
  {
    title: '9. Check setup',
    description: 'After restringing, check action, intonation, and truss rod. New string gauge may require adjustments.',
    tip: 'If changing gauges significantly, give the neck a day to adjust before making truss rod changes.'
  },
  {
    title: '10. Final tuning',
    description: 'Do multiple tuning passes. Play through all positions to ensure strings are settled and stable.',
    tip: 'Fresh bass strings can take a day or two to fully stabilize.'
  }
]

interface FloydStep {
  title: string
  description: string
  tip?: string
  illustration?: ReactNode
}

const FLOYD_ROSE_TIPS: FloydStep[] = [
  {
    title: 'Floyd Rose Special Notes',
    description: 'Floyd Rose and floating tremolo systems require extra care when restringing.',
  },
  {
    title: 'Block the tremolo',
    description: 'Place a block of wood or a tremolo stopper behind the bridge to keep it level while changing strings.',
    tip: 'This prevents the bridge from diving or rising as you change string tension.',
    illustration: <FloydRoseBlockIllustration />
  },
  {
    title: 'Change one string at a time',
    description: 'Never remove all strings at once on a Floyd Rose. This destabilizes the floating bridge balance.',
  },
  {
    title: 'Clip the ball end',
    description: 'Cut off the ball end of the string. Insert the plain end into the saddle and tighten the locking screw.',
    tip: 'Don\'t over-tighten the saddle screws - just enough to hold the string firmly.'
  },
  {
    title: 'Lock the nut last',
    description: 'Only lock the nut clamps after all strings are tuned and stretched. Use the fine tuners for final adjustments.',
    illustration: <LockingNutIllustration />
  }
]

export default function RestringGuide() {
  const [instrument, setInstrument] = useState<InstrumentType>('guitar')
  const [bridgeType, setBridgeType] = useState<BridgeType>('hardtail')
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const steps = instrument === 'guitar' ? GUITAR_STEPS : BASS_STEPS

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const resetProgress = () => {
    setCompletedSteps(new Set())
  }

  const progress = (completedSteps.size / steps.length) * 100

  return (
    <div className="restring-guide">
      <div className="guide-options">
        <div className="option-group">
          <label>Instrument</label>
          <div className="button-group">
            <button
              className={instrument === 'guitar' ? 'active' : ''}
              onClick={() => { setInstrument('guitar'); resetProgress() }}
            >
              Guitar
            </button>
            <button
              className={instrument === 'bass' ? 'active' : ''}
              onClick={() => { setInstrument('bass'); resetProgress() }}
            >
              Bass
            </button>
          </div>
        </div>

        {instrument === 'guitar' && (
          <div className="option-group">
            <label>Bridge Type</label>
            <div className="button-group">
              <button
                className={bridgeType === 'hardtail' ? 'active' : ''}
                onClick={() => setBridgeType('hardtail')}
              >
                Hardtail
              </button>
              <button
                className={bridgeType === 'tremolo' ? 'active' : ''}
                onClick={() => setBridgeType('tremolo')}
              >
                Tremolo
              </button>
              <button
                className={bridgeType === 'floyd' ? 'active' : ''}
                onClick={() => setBridgeType('floyd')}
              >
                Floyd Rose
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
        <span className="progress-text">
          {completedSteps.size} / {steps.length} steps complete
        </span>
      </div>

      {instrument === 'guitar' && bridgeType === 'floyd' && (
        <div className="floyd-tips">
          {FLOYD_ROSE_TIPS.map((tip, index) => (
            <div key={index} className="floyd-tip">
              <h4>{tip.title}</h4>
              <p>{tip.description}</p>
              {tip.illustration && (
                <div className="step-illustration">
                  {tip.illustration}
                </div>
              )}
              {tip.tip && <p className="tip">{tip.tip}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="steps-list">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step ${completedSteps.has(index) ? 'completed' : ''}`}
            onClick={() => toggleStep(index)}
          >
            <div className="step-checkbox">
              {completedSteps.has(index) ? '✓' : index + 1}
            </div>
            <div className="step-content">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {step.illustration && (
                <div className="step-illustration">
                  {step.illustration}
                </div>
              )}
              {step.tip && <p className="tip">{step.tip}</p>}
            </div>
          </div>
        ))}
      </div>

      {completedSteps.size === steps.length && (
        <div className="completion-message">
          All done! Your {instrument} is freshly strung and ready to play!
        </div>
      )}

      <button className="reset-button" onClick={resetProgress}>
        Reset Progress
      </button>
    </div>
  )
}
