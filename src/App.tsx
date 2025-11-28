import { useState } from 'react'
import './App.css'
import Tuner from './components/Tuner'
import RestringGuide from './components/RestringGuide'
import StringCalculator from './components/StringCalculator'

type Tab = 'tuner' | 'guide' | 'calculator'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('tuner')

  return (
    <div className="app">
      <header>
        <h1>StringThing</h1>
        <p className="subtitle">Bass & Guitar Restringing Assistant</p>
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
          className={activeTab === 'calculator' ? 'active' : ''}
          onClick={() => setActiveTab('calculator')}
        >
          Calculator
        </button>
      </nav>

      <main>
        {activeTab === 'tuner' && <Tuner />}
        {activeTab === 'guide' && <RestringGuide />}
        {activeTab === 'calculator' && <StringCalculator />}
      </main>
    </div>
  )
}

export default App
