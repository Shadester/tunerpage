import { useState } from 'react'
import './App.css'
import TunerV2 from './components/TunerV2'
import RestringGuide from './components/RestringGuide'
import StringCalculator from './components/StringCalculator'
import StringGaugeRecommender from './components/StringGaugeRecommender'
import FretBuzzDiagnostic from './components/FretBuzzDiagnostic'
import SetupGuide from './components/SetupGuide'
import TrussRodGuide from './components/TrussRodGuide'

type Tab = 'tuner' | 'guide' | 'calculator' | 'gauges' | 'buzz' | 'setup' | 'trussrod'
export type Instrument = 'guitar' | 'bass'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('tuner')
  const [instrument, setInstrument] = useState<Instrument>('guitar')

  return (
    <div className="app">
      <header>
        <div className="header-content">
          <h1>StringThing</h1>
          <div className="segmented-buttons">
            <button
              className={instrument === 'guitar' ? 'active' : ''}
              onClick={() => setInstrument('guitar')}
            >
              Guitar
            </button>
            <button
              className={instrument === 'bass' ? 'active' : ''}
              onClick={() => setInstrument('bass')}
            >
              Bass
            </button>
          </div>
        </div>
        <p className="subtitle">Your Complete Guitar & Bass Toolkit</p>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === 'tuner' ? 'active' : ''}
          onClick={() => setActiveTab('tuner')}
        >
          Tuner
        </button>
        <button
          className={activeTab === 'guide' ? 'active' : ''}
          onClick={() => setActiveTab('guide')}
        >
          Restring Guide
        </button>
        <button
          className={activeTab === 'gauges' ? 'active' : ''}
          onClick={() => setActiveTab('gauges')}
        >
          Gauge Recommender
        </button>
        <button
          className={activeTab === 'buzz' ? 'active' : ''}
          onClick={() => setActiveTab('buzz')}
        >
          Fret Buzz Fix
        </button>
        <button
          className={activeTab === 'calculator' ? 'active' : ''}
          onClick={() => setActiveTab('calculator')}
        >
          String Calculator
        </button>
        <button
          className={activeTab === 'setup' ? 'active' : ''}
          onClick={() => setActiveTab('setup')}
        >
          Action & Intonation
        </button>
        <button
          className={activeTab === 'trussrod' ? 'active' : ''}
          onClick={() => setActiveTab('trussrod')}
        >
          Truss Rod
        </button>
      </nav>

      <main>
        {activeTab === 'tuner' && <TunerV2 instrument={instrument} />}
        {activeTab === 'guide' && <RestringGuide instrument={instrument} />}
        {activeTab === 'calculator' && <StringCalculator instrument={instrument} />}
        {activeTab === 'gauges' && <StringGaugeRecommender instrument={instrument} />}
        {activeTab === 'buzz' && <FretBuzzDiagnostic instrument={instrument} />}
        {activeTab === 'setup' && <SetupGuide instrument={instrument} />}
        {activeTab === 'trussrod' && <TrussRodGuide instrument={instrument} />}
      </main>
    </div>
  )
}

export default App
