export function StringWindingIllustration() {
  return (
    <svg viewBox="0 0 200 120" className="illustration">
      <defs>
        <linearGradient id="postGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#888" />
          <stop offset="50%" stopColor="#ccc" />
          <stop offset="100%" stopColor="#888" />
        </linearGradient>
      </defs>
      {/* Tuning post */}
      <rect x="85" y="20" width="30" height="80" rx="15" fill="url(#postGradient)" />
      <ellipse cx="100" cy="20" rx="15" ry="6" fill="#aaa" />
      {/* String hole */}
      <rect x="95" y="45" width="10" height="4" fill="#333" />
      {/* String windings - going downward */}
      <path
        d="M 105 47
           C 130 47, 130 55, 100 55
           C 70 55, 70 63, 100 63
           C 130 63, 130 71, 100 71
           C 70 71, 70 79, 100 79"
        fill="none"
        stroke="#d4a574"
        strokeWidth="2"
      />
      {/* String coming from nut */}
      <line x1="0" y1="47" x2="95" y2="47" stroke="#d4a574" strokeWidth="2" />
      {/* String end sticking out */}
      <line x1="105" y1="47" x2="115" y2="40" stroke="#d4a574" strokeWidth="2" />
      {/* Labels */}
      <text x="40" y="38" fill="#888" fontSize="10">From nut</text>
      <text x="140" y="60" fill="#00ff88" fontSize="9">Wrap 1</text>
      <text x="140" y="72" fill="#00ff88" fontSize="9">Wrap 2</text>
      <text x="140" y="84" fill="#00ff88" fontSize="9">Wrap 3</text>
      {/* Arrow showing downward direction */}
      <path d="M 60 55 L 60 80 L 55 75 M 60 80 L 65 75" stroke="#00d4ff" strokeWidth="1.5" fill="none" />
      <text x="42" y="68" fill="#00d4ff" fontSize="8">Wind down</text>
    </svg>
  )
}

export function StringSlackIllustration() {
  return (
    <svg viewBox="0 0 280 100" className="illustration">
      {/* Nut */}
      <rect x="30" y="35" width="8" height="30" fill="#f5f5dc" rx="1" />
      <text x="26" y="80" fill="#888" fontSize="9">Nut</text>

      {/* Tuning posts */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx={100 + i * 50} cy="50" r="12" fill="#999" />
          <circle cx={100 + i * 50} cy="50" r="6" fill="#666" />
          <text x={96 + i * 50} y="75" fill="#666" fontSize="8">{i + 1}</text>
        </g>
      ))}

      {/* String - taut portion */}
      <line x1="38" y1="50" x2="88" y2="50" stroke="#d4a574" strokeWidth="2" />

      {/* String - slack portion (curved) */}
      <path
        d="M 88 50 Q 120 65, 150 50"
        fill="none"
        stroke="#d4a574"
        strokeWidth="2"
        strokeDasharray="4,2"
      />

      {/* Measurement bracket */}
      <path d="M 88 30 L 88 25 L 150 25 L 150 30" stroke="#00d4ff" strokeWidth="1" fill="none" />
      <text x="105" y="20" fill="#00d4ff" fontSize="9">2-3 posts of slack</text>

      {/* Legend */}
      <line x1="200" y1="25" x2="220" y2="25" stroke="#d4a574" strokeWidth="2" />
      <text x="225" y="28" fill="#888" fontSize="8">String</text>
      <line x1="200" y1="38" x2="220" y2="38" stroke="#d4a574" strokeWidth="2" strokeDasharray="4,2" />
      <text x="225" y="41" fill="#888" fontSize="8">Slack</text>
    </svg>
  )
}

export function BridgePinIllustration() {
  return (
    <svg viewBox="0 0 160 120" className="illustration">
      {/* Bridge body */}
      <rect x="20" y="60" width="120" height="25" fill="#8b4513" rx="3" />
      <rect x="20" y="55" width="120" height="8" fill="#a0522d" rx="2" />

      {/* Pin holes */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <circle cx={35 + i * 18} cy="72" r="5" fill="#333" />
        </g>
      ))}

      {/* One pin inserted with string */}
      <ellipse cx="35" cy="68" rx="4" ry="6" fill="#f5f5dc" />
      <circle cx="35" cy="64" r="2" fill="#333" />

      {/* String going up from pin */}
      <line x1="35" y1="55" x2="35" y2="20" stroke="#d4a574" strokeWidth="1.5" />
      <text x="42" y="40" fill="#888" fontSize="8">To tuner</text>

      {/* Ball end visible */}
      <circle cx="35" cy="78" r="3" fill="#c0c0c0" stroke="#888" />

      {/* Labels */}
      <text x="55" y="95" fill="#888" fontSize="9">Bridge pins</text>
      <text x="10" y="110" fill="#00d4ff" fontSize="8">Ball end seats under pin</text>
    </svg>
  )
}

export function ThroughBodyIllustration() {
  return (
    <svg viewBox="0 0 120 140" className="illustration">
      {/* Guitar body cross-section */}
      <rect x="20" y="30" width="80" height="80" fill="#8b4513" rx="5" />
      <rect x="25" y="35" width="70" height="70" fill="#a0522d" rx="3" />

      {/* String ferrule on back */}
      <circle cx="60" cy="105" r="6" fill="#c0c0c0" />
      <circle cx="60" cy="105" r="3" fill="#333" />

      {/* String channel through body */}
      <line x1="60" y1="105" x2="60" y2="45" stroke="#333" strokeWidth="3" strokeDasharray="2,2" />

      {/* Bridge saddle */}
      <rect x="45" y="40" width="30" height="8" fill="#999" rx="2" />

      {/* String */}
      <line x1="60" y1="105" x2="60" y2="40" stroke="#d4a574" strokeWidth="1.5" />
      <line x1="60" y1="40" x2="60" y2="10" stroke="#d4a574" strokeWidth="1.5" />

      {/* Ball end */}
      <circle cx="60" cy="108" r="2.5" fill="#c0c0c0" />

      {/* Labels */}
      <text x="75" y="108" fill="#888" fontSize="7">Ferrule</text>
      <text x="75" y="45" fill="#888" fontSize="7">Saddle</text>
      <text x="65" y="20" fill="#888" fontSize="7">To nut</text>

      {/* Arrow showing string path */}
      <path d="M 35 110 L 35 35 L 40 40 M 35 35 L 30 40" stroke="#00d4ff" strokeWidth="1" fill="none" />
    </svg>
  )
}

export function StretchingIllustration() {
  return (
    <svg viewBox="0 0 200 100" className="illustration">
      {/* Fretboard */}
      <rect x="10" y="45" width="180" height="20" fill="#5c4033" rx="2" />

      {/* Frets */}
      {[40, 70, 95, 115, 132, 147].map((x) => (
        <rect key={x} x={x} y="44" width="2" height="22" fill="#c0c0c0" />
      ))}

      {/* String at rest */}
      <line x1="10" y1="55" x2="190" y2="55" stroke="#666" strokeWidth="1" strokeDasharray="3,3" />

      {/* String being pulled */}
      <path
        d="M 10 55 Q 100 30, 190 55"
        fill="none"
        stroke="#d4a574"
        strokeWidth="2"
      />

      {/* Hand/finger pulling */}
      <ellipse cx="100" cy="25" rx="12" ry="8" fill="#deb887" />
      <path d="M 95 30 L 100 38" stroke="#deb887" strokeWidth="4" strokeLinecap="round" />

      {/* Arrow showing pull direction */}
      <path d="M 100 45 L 100 32 L 95 37 M 100 32 L 105 37" stroke="#00d4ff" strokeWidth="1.5" fill="none" />

      {/* Labels */}
      <text x="70" y="90" fill="#888" fontSize="9">Pull gently at multiple points</text>
      <text x="155" y="40" fill="#00d4ff" fontSize="8">~1 inch</text>
    </svg>
  )
}

export function FloydRoseBlockIllustration() {
  return (
    <svg viewBox="0 0 180 100" className="illustration">
      {/* Guitar body */}
      <rect x="10" y="50" width="160" height="40" fill="#333" rx="3" />

      {/* Tremolo cavity */}
      <rect x="40" y="50" width="80" height="35" fill="#1a1a1a" />

      {/* Floyd Rose bridge */}
      <rect x="50" y="35" width="60" height="20" fill="#888" rx="2" />
      <rect x="55" y="30" width="50" height="8" fill="#666" rx="1" />

      {/* Spring cavity */}
      <rect x="100" y="60" width="50" height="25" fill="#0a0a0a" />

      {/* Springs */}
      <path d="M 105 65 L 145 70" stroke="#aaa" strokeWidth="2" />
      <path d="M 105 72 L 145 77" stroke="#aaa" strokeWidth="2" />
      <path d="M 105 79 L 145 84" stroke="#aaa" strokeWidth="2" />

      {/* Block of wood */}
      <rect x="60" y="55" width="25" height="25" fill="#deb887" stroke="#a0522d" strokeWidth="1" rx="2" />
      <text x="65" y="71" fill="#5c4033" fontSize="8">Block</text>

      {/* Labels */}
      <text x="15" y="95" fill="#00d4ff" fontSize="8">Block prevents bridge dive</text>
    </svg>
  )
}

export function LockingNutIllustration() {
  return (
    <svg viewBox="0 0 200 80" className="illustration">
      {/* Headstock */}
      <rect x="10" y="25" width="40" height="40" fill="#333" rx="3" />

      {/* Locking nut */}
      <rect x="50" y="30" width="25" height="30" fill="#888" rx="2" />

      {/* Nut clamps */}
      <rect x="52" y="28" width="7" height="8" fill="#666" rx="1" />
      <rect x="61" y="28" width="7" height="8" fill="#666" rx="1" />
      <rect x="70" y="28" width="7" height="8" fill="#666" rx="1" />

      {/* Clamp screws */}
      <circle cx="55.5" cy="26" r="2" fill="#444" />
      <circle cx="64.5" cy="26" r="2" fill="#444" />
      <circle cx="73.5" cy="26" r="2" fill="#444" />

      {/* Fretboard */}
      <rect x="75" y="35" width="115" height="20" fill="#5c4033" rx="2" />

      {/* Strings */}
      {[40, 45, 50].map((y, i) => (
        <line key={i} x1="55" y1={y} x2="190" y2={y} stroke="#d4a574" strokeWidth={1.5 - i * 0.3} />
      ))}

      {/* Labels */}
      <text x="50" y="72" fill="#888" fontSize="8">Locking nut</text>
      <text x="100" y="72" fill="#00d4ff" fontSize="8">Lock AFTER tuning</text>
    </svg>
  )
}

export function BassStringCutIllustration() {
  return (
    <svg viewBox="0 0 240 90" className="illustration">
      {/* Tuning posts */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle cx={40 + i * 45} cy="45" r="14" fill="#999" />
          <circle cx={40 + i * 45} cy="45" r="8" fill="#666" />
        </g>
      ))}

      {/* String - full length before cut */}
      <line x1="0" y1="45" x2="210" y2="45" stroke="#d4a574" strokeWidth="4" strokeDasharray="4,2" opacity="0.4" />

      {/* String - proper length */}
      <line x1="0" y1="45" x2="150" y2="45" stroke="#d4a574" strokeWidth="4" />

      {/* Cut mark */}
      <line x1="148" y1="30" x2="152" y2="60" stroke="#ff4444" strokeWidth="2" />
      <line x1="152" y1="30" x2="148" y2="60" stroke="#ff4444" strokeWidth="2" />

      {/* Measurement bracket */}
      <path d="M 130 65 L 130 70 L 175 70 L 175 65" stroke="#00d4ff" strokeWidth="1" fill="none" />
      <text x="135" y="82" fill="#00d4ff" fontSize="9">3-4" past peg</text>

      {/* Target peg indicator */}
      <circle cx="130" cy="45" r="14" fill="none" stroke="#00ff88" strokeWidth="2" strokeDasharray="3,2" />
      <text x="120" y="25" fill="#00ff88" fontSize="8">Target peg</text>

      {/* Warning */}
      <text x="5" y="15" fill="#ff6b6b" fontSize="9">Cut BEFORE winding (bass strings too thick)</text>
    </svg>
  )
}

// Illustration wrapper with styling
export function IllustrationWrapper({ children, caption }: { children: React.ReactNode; caption?: string }) {
  return (
    <div className="illustration-wrapper">
      {children}
      {caption && <p className="illustration-caption">{caption}</p>}
    </div>
  )
}
