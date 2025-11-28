# String Setup

A web app to help with restringing guitars and basses. Features a chromatic tuner, step-by-step restringing guide, and a string slack calculator.

## Features

### Tuner
- Real-time pitch detection using your microphone
- Shows detected note, octave, frequency, and cents deviation
- Visual indicator showing if you're sharp, flat, or in tune
- **Playable reference tones** - click any note to hear a realistic plucked string sound
- Reference notes for standard guitar (6-string) and bass (4 & 5-string) tunings
- Synthesized string sounds with harmonics for clear, audible reference pitches

### Restring Guide
- Step-by-step instructions for guitar and bass
- Progress tracking with checkable steps
- Tips for each step to help avoid common mistakes
- Special instructions for Floyd Rose / floating tremolo systems

### String Calculator
- Calculate the right amount of slack for proper winding
- Supports guitar (standard, vintage, locking tuners) and bass
- Common scale length presets (Fender, Gibson, PRS, etc.)
- Measurement guide explaining what to measure and where
- All measurements in cm (scale lengths in inches)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Build

```bash
npm run build
npm run preview
```

## Tech Stack

- React 19
- TypeScript
- Vite
- Web Audio API (pitch detection & tone generation)
