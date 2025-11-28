export function ScaleLengthDiagram() {
  return (
    <svg viewBox="0 0 400 80" className="illustration wide">
      {/* Nut */}
      <rect x="30" y="25" width="6" height="30" fill="#f5f5dc" rx="1" />
      <text x="22" y="70" fill="#888" fontSize="9" textAnchor="middle">Nut</text>

      {/* Fretboard */}
      <rect x="36" y="30" width="280" height="20" fill="#5c4033" rx="2" />

      {/* Frets */}
      {[70, 100, 125, 147, 166, 183].map((x) => (
        <rect key={x} x={x} y="29" width="2" height="22" fill="#c0c0c0" />
      ))}

      {/* 12th fret marker */}
      <circle cx="183" cy="40" r="3" fill="#888" />

      {/* Bridge/Saddle */}
      <rect x="316" y="28" width="30" height="24" fill="#888" rx="2" />
      <text x="331" y="70" fill="#888" fontSize="9" textAnchor="middle">Bridge</text>

      {/* String */}
      <line x1="33" y1="40" x2="330" y2="40" stroke="#d4a574" strokeWidth="1.5" />

      {/* Scale length measurement */}
      <path d="M 33 15 L 33 10 L 330 10 L 330 15" stroke="#00d4ff" strokeWidth="1.5" fill="none" />
      <text x="181" y="8" fill="#00d4ff" fontSize="10" textAnchor="middle">Scale Length (nut to bridge saddle)</text>

      {/* Half scale length */}
      <path d="M 33 55 L 33 60 L 183 60 L 183 55" stroke="#00ff88" strokeWidth="1" fill="none" />
      <text x="108" y="75" fill="#00ff88" fontSize="8" textAnchor="middle">Half = 12th fret</text>
    </svg>
  )
}

export function NutToTunerDiagram() {
  return (
    <svg viewBox="0 0 320 100" className="illustration wide">
      {/* Headstock */}
      <path
        d="M 10 30 L 100 30 L 100 70 L 10 70 L 10 50 Q 0 50, 0 40 L 0 40 Q 0 30, 10 30"
        fill="#333"
      />

      {/* Nut */}
      <rect x="100" y="25" width="8" height="50" fill="#f5f5dc" rx="2" />
      <text x="104" y="90" fill="#888" fontSize="9" textAnchor="middle">Nut</text>

      {/* Tuning pegs - inline style (Fender) */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <circle cx={25 + i * 12} cy="50" r="8" fill="#999" />
          <circle cx={25 + i * 12} cy="50" r="4" fill="#666" />
          <text x={25 + i * 12} y="38" fill="#666" fontSize="7" textAnchor="middle">{6 - i}</text>
        </g>
      ))}

      {/* String to first tuner */}
      <line x1="108" y1="50" x2="85" y2="50" stroke="#d4a574" strokeWidth="1.5" />

      {/* Measurement bracket */}
      <path d="M 85 65 L 85 72 L 108 72 L 108 65" stroke="#00d4ff" strokeWidth="1.5" fill="none" />
      <text x="96" y="85" fill="#00d4ff" fontSize="9" textAnchor="middle">A</text>

      {/* Fretboard hint */}
      <rect x="108" y="35" width="100" height="30" fill="#5c4033" rx="2" />
      <line x1="108" y1="50" x2="208" y2="50" stroke="#d4a574" strokeWidth="1.5" />

      {/* Legend */}
      <text x="220" y="45" fill="#00d4ff" fontSize="9">A = Nut to 1st tuner</text>
      <text x="220" y="58" fill="#888" fontSize="8">Measure from nut edge</text>
      <text x="220" y="71" fill="#888" fontSize="8">to center of tuner post</text>
    </svg>
  )
}

export function WindingDiagram() {
  return (
    <svg viewBox="0 0 280 110" className="illustration wide">
      {/* Tuner posts */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={35 + i * 70} y="20" width="24" height="60" rx="12" fill="linear-gradient(to right, #888, #ccc, #888)" />
          <ellipse cx={47 + i * 70} cy="20" rx="12" ry="5" fill="#aaa" />
          <rect x={42 + i * 70} y="40" width="10" height="4" fill="#333" />
        </g>
      ))}

      {/* Labels for each post */}
      <text x="47" y="95" fill="#888" fontSize="8" textAnchor="middle">2 wraps</text>
      <text x="117" y="95" fill="#00ff88" fontSize="8" textAnchor="middle">3 wraps</text>
      <text x="187" y="95" fill="#888" fontSize="8" textAnchor="middle">4 wraps</text>

      {/* Windings on middle post (ideal) */}
      <path
        d="M 122 42
           C 145 42, 145 50, 117 50
           C 89 50, 89 58, 117 58
           C 145 58, 145 66, 117 66"
        fill="none"
        stroke="#d4a574"
        strokeWidth="2"
      />

      {/* Good indicator */}
      <text x="117" y="12" fill="#00ff88" fontSize="10" textAnchor="middle">Ideal</text>

      {/* Legend */}
      <rect x="210" y="20" width="60" height="70" fill="#1a1a2e" rx="6" />
      <text x="240" y="38" fill="#888" fontSize="8" textAnchor="middle">Wraps:</text>
      <text x="240" y="52" fill="#ff6b6b" fontSize="8" textAnchor="middle">2 = may slip</text>
      <text x="240" y="66" fill="#00ff88" fontSize="8" textAnchor="middle">3 = ideal</text>
      <text x="240" y="80" fill="#ffa500" fontSize="8" textAnchor="middle">4+ = OK</text>
    </svg>
  )
}

export function SlackMeasurementDiagram() {
  return (
    <svg viewBox="0 0 350 90" className="illustration wide">
      {/* Tuning pegs */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle cx={40 + i * 55} cy="45" r="15" fill="#999" />
          <circle cx={40 + i * 55} cy="45" r="8" fill="#666" />
        </g>
      ))}

      {/* String - taut to target peg */}
      <line x1="205" y1="45" x2="350" y2="45" stroke="#d4a574" strokeWidth="2" />

      {/* String - slack portion (shown going back) */}
      <path
        d="M 205 45 C 180 60, 155 55, 130 50"
        fill="none"
        stroke="#d4a574"
        strokeWidth="2"
        strokeDasharray="4,2"
      />

      {/* Target peg highlight */}
      <circle cx="150" cy="45" r="17" fill="none" stroke="#00ff88" strokeWidth="2" />
      <text x="150" y="75" fill="#00ff88" fontSize="8" textAnchor="middle">Target peg</text>

      {/* Slack measurement */}
      <path d="M 150 25 L 150 18 L 205 18 L 205 25" stroke="#00d4ff" strokeWidth="1.5" fill="none" />
      <text x="177" y="12" fill="#00d4ff" fontSize="9" textAnchor="middle">Slack = ~1 peg</text>

      {/* Arrow showing direction */}
      <path d="M 280 55 L 220 55 L 225 50 M 220 55 L 225 60" stroke="#888" strokeWidth="1" fill="none" />
      <text x="250" y="68" fill="#888" fontSize="7" textAnchor="middle">From bridge</text>
    </svg>
  )
}

export function CalculatorHelpDiagram() {
  return (
    <svg viewBox="0 0 380 160" className="illustration calculator-help">
      {/* Guitar outline */}
      <path
        d="M 20 80
           Q 20 40, 60 40
           L 120 40
           L 120 30
           Q 120 20, 130 20
           L 190 20
           L 190 30
           L 190 50
           Q 250 50, 280 80
           Q 310 110, 280 130
           Q 250 150, 190 150
           L 190 140
           L 130 140
           Q 120 140, 120 130
           L 120 120
           L 60 120
           Q 20 120, 20 80
           Z"
        fill="none"
        stroke="#444"
        strokeWidth="2"
      />

      {/* Headstock */}
      <rect x="20" y="55" width="50" height="50" fill="#333" rx="5" />

      {/* Tuners */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx={35 + i * 12} cy="70" r="6" fill="#888" />
          <circle cx={35 + i * 12} cy="90" r="6" fill="#888" />
        </g>
      ))}

      {/* Nut */}
      <rect x="70" y="52" width="5" height="56" fill="#f5f5dc" rx="1" />

      {/* Fretboard */}
      <rect x="75" y="55" width="115" height="50" fill="#5c4033" />

      {/* Bridge */}
      <rect x="240" y="65" width="25" height="30" fill="#888" rx="3" />

      {/* Measurement A: Nut to tuner */}
      <path d="M 35 105 L 35 115 L 72 115 L 72 105" stroke="#00d4ff" strokeWidth="1.5" fill="none" />
      <circle cx="54" cy="120" r="10" fill="#00d4ff" />
      <text x="54" y="124" fill="#000" fontSize="10" fontWeight="bold" textAnchor="middle">A</text>

      {/* Measurement B: Scale length */}
      <path d="M 72 42 L 72 35 L 252 35 L 252 42" stroke="#00ff88" strokeWidth="1.5" fill="none" />
      <circle cx="162" cy="28" r="10" fill="#00ff88" />
      <text x="162" y="32" fill="#000" fontSize="10" fontWeight="bold" textAnchor="middle">B</text>

      {/* Legend */}
      <rect x="280" y="45" width="95" height="70" fill="#1a1a2e" rx="6" />
      <circle cx="295" cy="62" r="8" fill="#00d4ff" />
      <text x="295" y="66" fill="#000" fontSize="9" fontWeight="bold" textAnchor="middle">A</text>
      <text x="340" y="66" fill="#888" fontSize="9" textAnchor="middle">Nut → Tuner</text>

      <circle cx="295" cy="88" r="8" fill="#00ff88" />
      <text x="295" y="92" fill="#000" fontSize="9" fontWeight="bold" textAnchor="middle">B</text>
      <text x="340" y="92" fill="#888" fontSize="9" textAnchor="middle">Scale Length</text>
    </svg>
  )
}
