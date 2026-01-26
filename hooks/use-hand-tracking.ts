'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { WorkerMessage, WorkerResponse } from '@/workers/vision.worker'

interface HandLandmark {
  x: number
  y: number
  z: number
}

interface HandTrackingResult {
  landmarks: HandLandmark[][]
  worldLandmarks: HandLandmark[][]
  handednesses: Array<{ categoryName: string; score: number }>
  timestamp: number
  detectionTime: number
}

interface UseHandTrackingOptions {
  modelPath?: string
  numHands?: number
  minHandDetectionConfidence?: number
  minHandPresenceConfidence?: number
  minTrackingConfidence?: number
  onResults?: (results: HandTrackingResult) => void
  onError?: (error: string) => void
}

interface UseHandTrackingReturn {
  isInitialized: boolean
  isProcessing: boolean
  error: string | null
  processFrame: (imageData: ImageData) => void
  cleanup: () => void
  fps: number
}

export function useHandTracking({
  modelPath = '/models/hand_landmarker.task',
  numHands = 2,
  minHandDetectionConfidence = 0.7,
  minHandPresenceConfidence = 0.5,
  minTrackingConfidence = 0.5,
  onResults,
  onError
}: UseHandTrackingOptions = {}): UseHandTrackingReturn {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fps, setFps] = useState(0)
  
  const workerRef = useRef<Worker | null>(null)
  const frameCountRef = useRef(0)
  const lastFpsUpdateRef = useRef(Date.now())
  const processingRef = useRef(false)

  // Initialize worker
  useEffect(() => {
    const initializeWorker = async () => {
      try {
        console.log('🔧 Initializing MediaPipe worker...')
        
        // Create worker
        workerRef.current = new Worker(
          new URL('../workers/vision.worker.ts', import.meta.url),
          { type: 'module' }
        )
        
        // Handle worker messages
        workerRef.current.onmessage = (event: MessageEvent<WorkerResponse>) => {
          const { type, data, error: workerError } = event.data
          
          switch (type) {
            case 'initialized':
              console.log('✅ MediaPipe worker initialized successfully')
              setIsInitialized(true)
              setError(null)
              break
              
            case 'result':
              if (data && onResults) {
                onResults(data as HandTrackingResult)
              }
              setIsProcessing(false)
              processingRef.current = false
              
              // Update FPS
              frameCountRef.current++
              const now = Date.now()
              if (now - lastFpsUpdateRef.current >= 1000) {
                setFps(frameCountRef.current)
                frameCountRef.current = 0
                lastFpsUpdateRef.current = now
              }
              break
              
            case 'error':
              console.error('❌ Worker error:', workerError)
              setError(workerError || 'Unknown worker error')
              setIsProcessing(false)
              processingRef.current = false
              if (onError) {
                onError(workerError || 'Unknown worker error')
              }
              break
          }
        }
        
        // Handle worker errors
        workerRef.current.onerror = (error) => {
          console.error('❌ Worker error:', error)
          setError('Worker initialization failed')
          if (onError) {
            onError('Worker initialization failed')
          }
        }
        
        // Initialize MediaPipe in worker
        const initMessage: WorkerMessage = {
          type: 'init',
          data: {
            modelPath,
            options: {
              runningMode: 'VIDEO' as const,
              numHands,
              minHandDetectionConfidence,
              minHandPresenceConfidence,
              minTrackingConfidence
            }
          }
        }
        
        workerRef.current.postMessage(initMessage)
        
      } catch (err) {
        console.error('❌ Failed to initialize worker:', err)
        setError(`Failed to initialize worker: ${err}`)
        if (onError) {
          onError(`Failed to initialize worker: ${err}`)
        }
      }
    }
    
    initializeWorker()
    
    // Cleanup on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.postMessage({ type: 'destroy' })
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
  }, [
    modelPath,
    numHands,
    minHandDetectionConfidence,
    minHandPresenceConfidence,
    minTrackingConfidence,
    onResults,
    onError
  ])

  // Process frame function
  const processFrame = useCallback((imageData: ImageData) => {
    if (!workerRef.current || !isInitialized || processingRef.current) {
      return
    }
    
    try {
      setIsProcessing(true)
      processingRef.current = true
      
      const processMessage: WorkerMessage = {
        type: 'process',
        data: {
          imageData,
          timestamp: performance.now()
        }
      }
      
      workerRef.current.postMessage(processMessage, [imageData.data.buffer.slice()])
      
    } catch (err) {
      console.error('❌ Error processing frame:', err)
      setError(`Error processing frame: ${err}`)
      setIsProcessing(false)
      processingRef.current = false
      if (onError) {
        onError(`Error processing frame: ${err}`)
      }
    }
  }, [isInitialized, onError])

  // Cleanup function
  const cleanup = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'destroy' })
      workerRef.current.terminate()
      workerRef.current = null
    }
    setIsInitialized(false)
    setIsProcessing(false)
    setError(null)
    setFps(0)
    frameCountRef.current = 0
    processingRef.current = false
  }, [])

  return {
    isInitialized,
    isProcessing,
    error,
    processFrame,
    cleanup,
    fps
  }
}

// Utility function to convert landmarks to screen coordinates
export function landmarksToScreenCoords(
  landmarks: HandLandmark[],
  canvasWidth: number,
  canvasHeight: number
): Array<{ x: number; y: number }> {
  return landmarks.map(landmark => ({
    x: landmark.x * canvasWidth,
    y: landmark.y * canvasHeight
  }))
}

// Utility function to calculate distance between two landmarks
export function calculateDistance(
  landmark1: HandLandmark,
  landmark2: HandLandmark
): number {
  const dx = landmark1.x - landmark2.x
  const dy = landmark1.y - landmark2.y
  const dz = landmark1.z - landmark2.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

// Utility function to get hand center point
export function getHandCenter(landmarks: HandLandmark[]): HandLandmark {
  if (landmarks.length === 0) {
    return { x: 0, y: 0, z: 0 }
  }
  
  const sum = landmarks.reduce(
    (acc, landmark) => ({
      x: acc.x + landmark.x,
      y: acc.y + landmark.y,
      z: acc.z + landmark.z
    }),
    { x: 0, y: 0, z: 0 }
  )
  
  return {
    x: sum.x / landmarks.length,
    y: sum.y / landmarks.length,
    z: sum.z / landmarks.length
  }
}

// Hand landmark indices for easy reference
export const HAND_LANDMARKS = {
  WRIST: 0,
  THUMB_CMC: 1,
  THUMB_MCP: 2,
  THUMB_IP: 3,
  THUMB_TIP: 4,
  INDEX_FINGER_MCP: 5,
  INDEX_FINGER_PIP: 6,
  INDEX_FINGER_DIP: 7,
  INDEX_FINGER_TIP: 8,
  MIDDLE_FINGER_MCP: 9,
  MIDDLE_FINGER_PIP: 10,
  MIDDLE_FINGER_DIP: 11,
  MIDDLE_FINGER_TIP: 12,
  RING_FINGER_MCP: 13,
  RING_FINGER_PIP: 14,
  RING_FINGER_DIP: 15,
  RING_FINGER_TIP: 16,
  PINKY_MCP: 17,
  PINKY_PIP: 18,
  PINKY_DIP: 19,
  PINKY_TIP: 20
} as const