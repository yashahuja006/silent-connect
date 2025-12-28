import React from 'react'

interface ConfidenceMeterProps {
  confidence: number
}

const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ confidence }) => {
  const percentage = Math.round(confidence * 100)
  const isHighConfidence = confidence >= 0.7
  
  // Color based on confidence level
  const getConfidenceColor = () => {
    if (confidence >= 0.8) return 'text-green-400'
    if (confidence >= 0.7) return 'text-cyan-400'
    if (confidence >= 0.5) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getBarColor = () => {
    if (confidence >= 0.8) return 'bg-green-400'
    if (confidence >= 0.7) return 'bg-cyan-400'
    if (confidence >= 0.5) return 'bg-yellow-400'
    return 'bg-red-400'
  }

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-300">Confidence</span>
        <span className={`text-xs font-mono ${getConfidenceColor()}`}>
          {percentage}%
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${getBarColor()} ${
            isHighConfidence ? 'animate-pulse' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Confidence Status */}
      <div className="mt-1 text-xs text-center">
        {isHighConfidence ? (
          <span className="text-green-400">✓ Ready to speak</span>
        ) : (
          <span className="text-gray-400">Adjusting position...</span>
        )}
      </div>
    </div>
  )
}

export default ConfidenceMeter