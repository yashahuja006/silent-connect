'use client'

import { useState } from 'react'
import { saveCustomGesture } from '@/app/actions/gestures'
import { GlassButton } from '@/components/shared/glass-panel'

interface GestureSaveExampleProps {
  landmarks: Array<{ x: number; y: number; z: number }>
  gestureName: string
}

export function GestureSaveExample({ landmarks, gestureName }: GestureSaveExampleProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSaveGesture = async () => {
    if (!landmarks || landmarks.length !== 21) {
      setError('Invalid landmark data. Please ensure hand is detected properly.')
      return
    }

    if (!gestureName.trim()) {
      setError('Please enter a gesture name.')
      return
    }

    setIsLoading(true)
    setError(null)
    setMessage(null)

    try {
      const result = await saveCustomGesture({
        name: gestureName.trim(),
        description: `Custom gesture: ${gestureName}`,
        landmarks: landmarks,
        confidence_threshold: 0.7,
        category: 'custom',
      })

      if (result.success) {
        setMessage(result.message || 'Gesture saved successfully!')
      } else {
        setError(result.error || 'Failed to save gesture')
      }
    } catch (err) {
      console.error('Error saving gesture:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="glass-card p-6 space-y-4">
      <h3 className="text-xl font-heading text-electric">Save Custom Gesture</h3>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-300">
          Gesture: <span className="text-white font-medium">{gestureName}</span>
        </p>
        <p className="text-sm text-gray-300">
          Landmarks: <span className="text-white font-medium">{landmarks?.length || 0}/21</span>
        </p>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-300">
          {message}
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300">
          {error}
        </div>
      )}

      <GlassButton
        onClick={handleSaveGesture}
        disabled={isLoading || !landmarks || landmarks.length !== 21}
        className="w-full"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Saving...</span>
          </div>
        ) : (
          'Save Gesture'
        )}
      </GlassButton>
    </div>
  )
}

// Example usage in your component:
/*
import { GestureSaveExample } from '@/components/examples/gesture-save-example'

// In your component where you have hand tracking data:
<GestureSaveExample 
  landmarks={handLandmarks} 
  gestureName="My Custom Gesture" 
/>
*/