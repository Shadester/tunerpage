import { useState, useMemo } from 'react'
import './StringCalculator.css'
import {
  CalculatorHelpDiagram,
  ScaleLengthDiagram,
  NutToTunerDiagram,
  WindingDiagram
} from './illustrations/CalculatorDiagrams'

type InstrumentType = 'guitar' | 'bass4' | 'bass5'

interface TuningPegConfig {
  pegSpacing: number
  windingDiameter: number
}

const PEG_CONFIGS: Record<string, TuningPegConfig> = {
  standard: { pegSpacing: 35, windingDiameter: 10 },
  vintage: { pegSpacing: 38, windingDiameter: 11 },
  locking: { pegSpacing: 35, windingDiameter: 8 },
  bass: { pegSpacing: 45, windingDiameter: 15 }
}

const SCALE_LENGTHS: Record<InstrumentType, { name: string; length: number }[]> = {
  guitar: [
    { name: 'Fender (25.5")', length: 25.5 },
    { name: 'Gibson (24.75")', length: 24.75 },
    { name: 'PRS (25")', length: 25 },
    { name: 'Baritone (27")', length: 27 }
  ],
  bass4: [
    { name: 'Standard (34")', length: 34 },
    { name: 'Short Scale (30")', length: 30 },
    { name: 'Medium Scale (32")', length: 32 },
    { name: 'Extra Long (35")', length: 35 }
  ],
  bass5: [
    { name: 'Standard (34")', length: 34 },
    { name: 'Extra Long (35")', length: 35 },
    { name: 'Super Long (36")', length: 36 }
  ]
}

interface StringResult {
  stringNumber: number
  nutToTuner: number
  slackNeeded: number
  windingTurns: number
  totalLength: number
}

export default function StringCalculator() {
  const [instrument, setInstrument] = useState<InstrumentType>('guitar')
  const [scaleLength, setScaleLength] = useState(25.5)
  const [nutToFirstTuner, setNutToFirstTuner] = useState(4)
  const [pegType, setPegType] = useState('standard')
  const [targetWraps, setTargetWraps] = useState(3)
  const [showHelp, setShowHelp] = useState(false)

  const stringCount = instrument === 'guitar' ? 6 : instrument === 'bass4' ? 4 : 5
  const pegConfig = instrument.startsWith('bass') ? PEG_CONFIGS.bass : PEG_CONFIGS[pegType]

  const results = useMemo((): StringResult[] => {
    const strings: StringResult[] = []

    for (let i = 1; i <= stringCount; i++) {
      const nutToTuner = nutToFirstTuner + (i - 1) * (pegConfig.pegSpacing / 25.4)
      const windingCircumference = Math.PI * (pegConfig.windingDiameter / 25.4)
      const slackNeeded = targetWraps * windingCircumference
      const windingTurns = targetWraps

      strings.push({
        stringNumber: i,
        nutToTuner: Math.round(nutToTuner * 10) / 10,
        slackNeeded: Math.round(slackNeeded * 10) / 10,
        windingTurns,
        totalLength: Math.round((scaleLength + nutToTuner + slackNeeded) * 10) / 10
      })
    }

    return strings
  }, [stringCount, nutToFirstTuner, pegConfig, targetWraps, scaleLength])

  return (
    <div className="string-calculator">
      <button
        className={`help-toggle ${showHelp ? 'active' : ''}`}
        onClick={() => setShowHelp(!showHelp)}
      >
        {showHelp ? 'Hide Measurement Guide' : 'How to Measure?'}
      </button>

      {showHelp && (
        <div className="help-section">
          <h3>Measurement Guide</h3>

          <div className="help-diagram">
            <CalculatorHelpDiagram />
          </div>

          <div className="help-item">
            <h4>A - Scale Length</h4>
            <p>
              The distance from the nut to the bridge saddle. This determines the vibrating length
              of the string and affects intonation.
            </p>
            <div className="help-diagram">
              <ScaleLengthDiagram />
            </div>
          </div>

          <div className="help-item">
            <h4>B - Nut to First Tuner</h4>
            <p>
              Measure from the edge of the nut to the center of the first (closest) tuning peg.
              This varies by headstock design.
            </p>
            <div className="help-diagram">
              <NutToTunerDiagram />
            </div>
          </div>

          <div className="help-item">
            <h4>Target Wraps</h4>
            <p>
              The number of times the string winds around the tuning post. More wraps create
              better break angle at the nut but too many can cause tuning instability.
            </p>
            <div className="help-diagram">
              <WindingDiagram />
            </div>
          </div>
        </div>
      )}

      <div className="calc-form">
        <div className="form-section">
          <h3>Instrument</h3>
          <div className="button-group">
            <button
              className={instrument === 'guitar' ? 'active' : ''}
              onClick={() => {
                setInstrument('guitar')
                setScaleLength(25.5)
                setPegType('standard')
              }}
            >
              Guitar
            </button>
            <button
              className={instrument === 'bass4' ? 'active' : ''}
              onClick={() => {
                setInstrument('bass4')
                setScaleLength(34)
              }}
            >
              Bass 4
            </button>
            <button
              className={instrument === 'bass5' ? 'active' : ''}
              onClick={() => {
                setInstrument('bass5')
                setScaleLength(34)
              }}
            >
              Bass 5
            </button>
          </div>
        </div>

        <div className="form-section">
          <h3>Scale Length</h3>
          <div className="scale-options">
            {SCALE_LENGTHS[instrument].map(scale => (
              <button
                key={scale.length}
                className={scaleLength === scale.length ? 'active' : ''}
                onClick={() => setScaleLength(scale.length)}
              >
                {scale.name}
              </button>
            ))}
          </div>
          <div className="custom-input">
            <label>Custom (inches):</label>
            <input
              type="number"
              value={scaleLength}
              onChange={e => setScaleLength(parseFloat(e.target.value) || 0)}
              step="0.25"
              min="20"
              max="40"
            />
          </div>
        </div>

        {instrument === 'guitar' && (
          <div className="form-section">
            <h3>Tuning Peg Type</h3>
            <div className="button-group">
              <button
                className={pegType === 'standard' ? 'active' : ''}
                onClick={() => setPegType('standard')}
              >
                Standard
              </button>
              <button
                className={pegType === 'vintage' ? 'active' : ''}
                onClick={() => setPegType('vintage')}
              >
                Vintage
              </button>
              <button
                className={pegType === 'locking' ? 'active' : ''}
                onClick={() => setPegType('locking')}
              >
                Locking
              </button>
            </div>
          </div>
        )}

        <div className="form-section">
          <h3>Measurements</h3>
          <div className="measurements">
            <div className="measurement">
              <label>Nut to 1st Tuner (inches):</label>
              <input
                type="number"
                value={nutToFirstTuner}
                onChange={e => setNutToFirstTuner(parseFloat(e.target.value) || 0)}
                step="0.5"
                min="2"
                max="10"
              />
            </div>
            <div className="measurement">
              <label>Target Wraps:</label>
              <input
                type="number"
                value={targetWraps}
                onChange={e => setTargetWraps(parseInt(e.target.value) || 2)}
                min="2"
                max="5"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="results">
        <h3>String Length Guide</h3>
        <p className="results-intro">
          Pull string taut to tuner, then add the slack shown below before cutting/winding:
        </p>

        <div className="results-table">
          <div className="table-header">
            <span>String</span>
            <span>Nut to Tuner</span>
            <span>Slack to Add</span>
            <span>Wraps</span>
          </div>
          {results.map(result => (
            <div key={result.stringNumber} className="table-row">
              <span className="string-num">{result.stringNumber}</span>
              <span>{result.nutToTuner}"</span>
              <span className="slack-value">{result.slackNeeded}"</span>
              <span>{result.windingTurns}</span>
            </div>
          ))}
        </div>

        <div className="quick-ref">
          <h4>Quick Reference</h4>
          <div className="quick-ref-content">
            <p>
              <strong>Easy method:</strong> Pull string taut to target tuner,
              then measure back <strong>{Math.round(results[0]?.slackNeeded || 0)}-{Math.round(results[stringCount - 1]?.slackNeeded || 0)}"</strong> of
              slack (about {targetWraps} tuner posts) before winding.
            </p>
            {instrument === 'guitar' && pegType === 'locking' && (
              <p className="locking-note">
                <strong>Locking tuners:</strong> You need minimal slack - just enough to
                insert into the peg hole and lock. 1-2 wraps maximum.
              </p>
            )}
          </div>
        </div>

        <div className="tips-section">
          <h4>Tips</h4>
          <ul>
            <li>
              <strong>Wound strings (thicker):</strong> Need fewer wraps (2-3) as they're
              stiffer and hold better.
            </li>
            <li>
              <strong>Plain strings (thinner):</strong> Benefit from more wraps (3-4) for
              tuning stability.
            </li>
            <li>
              <strong>Bass strings:</strong> Usually need only 2-3 wraps due to thickness.
              Cut before winding!
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
