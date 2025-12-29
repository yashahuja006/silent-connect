import React from 'react'

interface CircularProgressProps {
  confidence: number
  size?: number
}

const CircularProgress: React.FC<CircularProgressProps> = ({ confidence, size = 60 }) => {
  // Convert confidence (0-100) to angle (0-360)
  const angle = (confidence / 100) * 360
  
  // Determine color based on confidence level
  const getProgressClass = (conf: number) => {
    if (conf >= 80) return 'progress-high'
    if (conf >= 50) return 'progress-medium'
    return 'progress-low'
  }

  const getProgressColor = (conf: number) => {
    if (conf >= 80) return '#22c55e'
    if (conf >= 50) return '#eab308'
    return '#ef4444'
  }

  return (
    <div 
      className={`circular-progress ${getProgressClass(confidence)}`}
      style={{
        '--progress-angle': `${angle}deg`,
        '--progress-color': getProgressColor(confidence),
        width: `${size}px`,
        height: `${size}px`
      } as React.CSSProperties}
    >
      <div className="progress-text">
        {Math.round(confidence)}%
      </div>
    </div>
  )
}

export default CircularProgress