import React, { useRef, useEffect } from 'react'
import Webcam from 'react-webcam'
import { useHandTracking } from '../hooks/useHandTracking'
import ConfidenceMeter from './ConfidenceMeter'

interface VideoFeedProps {
  onGestureDetected: (gesture: string, confidence: number) => void
  currentGesture: string | null
  confidence: number
}

const VideoFeed: React.FC<VideoFeedProps> = ({ 
  onGestureDetected, 
  currentGesture, 
  confidence 
}) => {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const { isLoaded, error } = useHandTracking(videoRef, canvasRef)

  useEffect(() => {
    // Set up video reference from webcam
    if (webcamRef.current?.video) {
      const video = webcamRef.current.video
      if (videoRef.current !== video) {
        // Create a new ref object if needed
        ;(videoRef as any).current = video
      }
    }
  }, [])

  useEffect(() => {
    // Notify parent component of gesture detection
    if (currentGesture && confidence >= 0.7) {
      onGestureDetected(currentGesture, confidence)
    }
  }, [currentGesture, confidence, onGestureDetected])

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: 'user'
  }

  return (
    <div className="cyber-card h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyber-cyan">Vision Engine</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isLoaded ? 'bg-cyber-green' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-300">
            {isLoaded ? 'Active' : 'Loading...'}
          </span>
        </div>
      </div>

      <div className="relative flex-1 bg-cyber-darker rounded-lg overflow-hidden">
        {/* Webcam Video */}
        <Webcam
          ref={webcamRef}
          audio={false}
          width={640}
          height={480}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full h-full object-cover"
          mirrored={true}
          onUserMedia={() => console.log('Camera access granted')}
          onUserMediaError={(error) => console.error('Camera error:', error)}
        />

        {/* Canvas overlay for hand landmarks */}
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />

        {/* Gesture Display Overlay */}
        {currentGesture && (
          <div className="absolute top-4 left-4 bg-cyber-dark/80 backdrop-blur-sm rounded-lg p-3 border border-cyber-cyan/30">
            <div className="gesture-display">{currentGesture}</div>
            <ConfidenceMeter confidence={confidence} gesture={currentGesture} />
          </div>
        )}

        {/* No Hands Detected Overlay */}
        {!currentGesture && isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-cyber-dark/60 backdrop-blur-sm rounded-lg p-6 text-center border border-cyber-teal/30">
              <div className="text-cyber-teal text-lg mb-2">👋</div>
              <div className="text-cyber-teal">Show your hand to start</div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="absolute top-4 right-4 bg-red-900/80 backdrop-blur-sm rounded-lg p-3 border border-red-500/30">
            <div className="text-red-300 text-sm">{error}</div>
          </div>
        )}

        {/* Loading Overlay */}
        {!isLoaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-cyber-dark/80">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
              <div className="text-cyber-cyan">Initializing MediaPipe...</div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
        <div>
          {isLoaded ? 'Hand tracking active' : 'Initializing...'}
        </div>
        <div>
          FPS: ~30 | Latency: ~12ms
        </div>
      </div>
    </div>
  )
}

export default VideoFeed