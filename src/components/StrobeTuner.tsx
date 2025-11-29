import { useEffect, useRef } from 'react'
import './StrobeTuner.css'

interface StrobeTunerProps {
  cents: number
  isPlaying: boolean
}

export default function StrobeTuner({ cents, isPlaying }: StrobeTunerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const rotationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 20

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#0a0a1e'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (isPlaying) {
        // Calculate rotation speed based on cents deviation
        // When in tune (0 cents), rotation is 0 (appears stopped)
        // When out of tune, rotates faster the further from 0
        const rotationSpeed = cents * 0.05 // 0.05 degrees per cent

        rotationRef.current += rotationSpeed

        // Draw strobe pattern
        const numSegments = 24
        const segmentAngle = (Math.PI * 2) / numSegments

        for (let i = 0; i < numSegments; i++) {
          const angle = i * segmentAngle + (rotationRef.current * Math.PI) / 180

          // Alternate colors for visibility
          const isAlternate = i % 2 === 0

          // Color based on tuning status
          let color
          if (Math.abs(cents) <= 5) {
            // In tune - green
            color = isAlternate ? '#00ff88' : '#00cc6a'
          } else if (cents < 0) {
            // Flat - red
            color = isAlternate ? '#ff6b6b' : '#ff4444'
          } else {
            // Sharp - orange
            color = isAlternate ? '#ff8c00' : '#ff7700'
          }

          // Draw segment
          ctx.beginPath()
          ctx.moveTo(centerX, centerY)
          ctx.arc(centerX, centerY, radius, angle, angle + segmentAngle)
          ctx.closePath()
          ctx.fillStyle = color
          ctx.fill()

          // Add white dividing lines
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
          ctx.lineWidth = 2
          ctx.stroke()
        }

        // Draw center circle
        ctx.beginPath()
        ctx.arc(centerX, centerY, 40, 0, Math.PI * 2)
        ctx.fillStyle = '#0a0a1e'
        ctx.fill()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.lineWidth = 3
        ctx.stroke()

        // Draw cents value in center
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 20px monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(`${cents > 0 ? '+' : ''}${cents}`, centerX, centerY)
      } else {
        // Not playing - show static pattern
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
        ctx.font = 'bold 18px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('Play a note...', centerX, centerY)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [cents, isPlaying])

  return (
    <div className="strobe-tuner">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="strobe-canvas"
      />
      <div className="strobe-status">
        {isPlaying && (
          <>
            {Math.abs(cents) <= 5 ? (
              <div className="status-in-tune">✓ IN TUNE</div>
            ) : cents < 0 ? (
              <div className="status-flat">↓ FLAT</div>
            ) : (
              <div className="status-sharp">↑ SHARP</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
