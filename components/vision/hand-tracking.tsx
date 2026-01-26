'use client'

import { useEffect, useRef, useState } from 'react'
import { GlassCard } from '@/components/shared/glass-panel'

interface HandTrackingProps {
  onHandDetected?: (landmarks: any[]) => void
  className?: string
}

export function HandTracking({ onHandDetected, className }: HandTrackingProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)

  useEffect(() => {
    let stream: MediaStream | null = null

    const initCamera = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Request camera access
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          }
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play()
            setCameraActive(true)
            setIsLoading(false)
          }
        }

        // Simulate hand detection for demo
        const interval = setInterval(() => {
          if (onHandDetected && cameraActive) {
            // Mock hand landmarks data
            const mockLandmarks = Array.from({ length: 21 }, (_, i) => ({
              x: Math.random(),
              y: Math.random(),
              z: Math.random() * 0.1
            }))
            onHandDetected([mockLandmarks])
          }
        }, 100)

        return () => {
          clearInterval(interval)
        }
      } catch (err) {
        setError('Camera access denied or not available')
        setIsLoading(false)
        console.error('Camera error:', err)
      }
    }

    initCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [onHandDetected, cameraActive])

  if (error) {
    return (
      <GlassCard className={`p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📷</span>
            </div>
            <h3 className="text-lg font-medium text-red-400 mb-2">Camera Error</h3>
            <p className="text-gray-400 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 glass-button px-4 py-2 text-sm text-white hover:text-electric transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className={`p-6 ${className}`}>
      <div className="relative">
        <h3 className="text-xl font-bold text-electric mb-4">Hand Tracking</h3>
        
        <div className="relative bg-black rounded-lg overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-electric-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white">Initializing camera...</p>
              </div>
            </div>
          )}
          
          <video
            ref={videoRef}
            className="w-full h-64 object-cover"
            autoPlay
            muted
            playsInline
          />
          
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: 'none' }}
          />
          
          {cameraActive && (
            <div className="absolute top-2 right-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-medium">LIVE</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Position your hand in front of the camera to begin tracking
          </p>
        </div>
      </div>
    </GlassCard>
  )
}