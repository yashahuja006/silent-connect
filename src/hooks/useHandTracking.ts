import { useEffect, useRef, useState, RefObject } from 'react'
import { HandTrackingResult, HandLandmark } from '../types'
import { GestureRecognizer } from '../utils/GestureRecognizer'

export const useHandTracking = (
  videoRef: RefObject<HTMLVideoElement>,
  canvasRef: RefObject<HTMLCanvasElement>
): HandTrackingResult => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentGesture, setCurrentGesture] = useState<string | null>(null)
  const [confidence, setConfidence] = useState(0)
  const [landmarks, setLandmarks] = useState<HandLandmark[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const handsRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const gestureRecognizer = useRef(new GestureRecognizer())
  const lastGestureTime = useRef<number>(0)
  const gestureHoldStart = useRef<number>(0)
  const lastTriggeredGesture = useRef<string | null>(null)
  const initializationTimeout = useRef<number | null>(null)

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return

    // Set a timeout for MediaPipe initialization
    initializationTimeout.current = setTimeout(() => {
      if (!isLoaded) {
        setError('MediaPipe is taking too long to load. Please refresh the page or try a different browser.')
      }
    }, 15000) // 15 second timeout

    const initializeHandTracking = async () => {
      try {
        console.log('Starting MediaPipe initialization...')
        
        // Try to load MediaPipe with timeout
        const loadPromise = Promise.all([
          import('@mediapipe/hands'),
          import('@mediapipe/camera_utils')
        ])

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('MediaPipe loading timeout')), 10000)
        })

        const [{ Hands }, { Camera }] = await Promise.race([loadPromise, timeoutPromise]) as any

        console.log('MediaPipe modules loaded, initializing...')
        
        const hands = new Hands({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
          }
        })

        hands.setOptions({
          maxNumHands: 1, // Reduced from 2 for better performance
          modelComplexity: 0, // Reduced from 1 for faster loading
          minDetectionConfidence: 0.7, // Increased for better accuracy
          minTrackingConfidence: 0.5
        })

        hands.onResults(onResults)
        handsRef.current = hands

        // Initialize camera with error handling
        if (videoRef.current) {
          const camera = new Camera(videoRef.current, {
            onFrame: async () => {
              if (handsRef.current && videoRef.current) {
                try {
                  await handsRef.current.send({ image: videoRef.current })
                } catch (err) {
                  console.warn('Frame processing error:', err)
                }
              }
            },
            width: 640,
            height: 480
          })

          cameraRef.current = camera
          await camera.start()
          
          // Clear timeout on successful initialization
          if (initializationTimeout.current) {
            clearTimeout(initializationTimeout.current)
          }
          
          setIsLoaded(true)
          console.log('MediaPipe initialized successfully!')
        }
        
      } catch (err) {
        console.error('MediaPipe initialization failed:', err)
        setError(`Failed to initialize hand tracking: ${err}. Try refreshing or use Chrome/Edge browser.`)
        
        if (initializationTimeout.current) {
          clearTimeout(initializationTimeout.current)
        }
      }
    }

    const onResults = (results: any) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const handLandmarks = results.multiHandLandmarks[0]
        
        // Convert MediaPipe landmarks to our format
        const convertedLandmarks: HandLandmark[] = handLandmarks.map((landmark: any) => ({
          x: landmark.x,
          y: landmark.y,
          z: landmark.z,
          visibility: landmark.visibility
        }))

        setLandmarks(convertedLandmarks)

        // Draw hand landmarks and connections
        drawHandLandmarks(ctx, convertedLandmarks, canvas.width, canvas.height)

        // Recognize gesture
        const gestureResult = gestureRecognizer.current.detectGesture(convertedLandmarks)
        
        if (gestureResult.gesture && gestureResult.confidence >= 0.7) {
          handleGestureDetection(gestureResult)
        } else {
          handleNoGesture()
        }
      } else {
        handleNoHands()
      }
    }

    const handleGestureDetection = (gestureResult: any) => {
      const now = Date.now()
      
      // Check if this is the same gesture as before
      if (gestureResult.gesture === currentGesture) {
        // Same gesture - check hold duration
        if (gestureHoldStart.current === 0) {
          gestureHoldStart.current = now
        }
        
        // If held for 1.5 seconds and not already triggered
        if (now - gestureHoldStart.current >= 1500 && 
            lastTriggeredGesture.current !== gestureResult.gesture) {
          // Trigger speech synthesis
          triggerSpeechSynthesis(gestureResult.gesture)
          lastTriggeredGesture.current = gestureResult.gesture
        }
      } else {
        // New gesture
        gestureHoldStart.current = 0
        lastTriggeredGesture.current = null
      }
      
      setCurrentGesture(gestureResult.gesture)
      setConfidence(gestureResult.confidence)
      lastGestureTime.current = now
    }

    const handleNoGesture = () => {
      // No confident gesture detected
      if (Date.now() - lastGestureTime.current > 500) {
        setCurrentGesture(null)
        setConfidence(0)
        gestureHoldStart.current = 0
        lastTriggeredGesture.current = null
      }
    }

    const handleNoHands = () => {
      // No hands detected
      setLandmarks(null)
      setCurrentGesture(null)
      setConfidence(0)
      gestureHoldStart.current = 0
      lastTriggeredGesture.current = null
    }

    initializeHandTracking()

    return () => {
      if (initializationTimeout.current) {
        clearTimeout(initializationTimeout.current)
      }
      if (cameraRef.current) {
        cameraRef.current.stop()
      }
      if (handsRef.current) {
        handsRef.current.close()
      }
    }
  }, [videoRef, canvasRef, currentGesture])

  const drawHandLandmarks = (
    ctx: CanvasRenderingContext2D, 
    landmarks: HandLandmark[], 
    width: number, 
    height: number
  ) => {
    // Draw connections between landmarks (green skeleton)
    ctx.strokeStyle = '#00ff80'
    ctx.lineWidth = 2

    // Hand connections (simplified version)
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // Index
      [0, 9], [9, 10], [10, 11], [11, 12], // Middle
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring
      [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
      [5, 9], [9, 13], [13, 17] // Palm connections
    ]

    connections.forEach(([start, end]) => {
      if (landmarks[start] && landmarks[end]) {
        ctx.beginPath()
        ctx.moveTo(landmarks[start].x * width, landmarks[start].y * height)
        ctx.lineTo(landmarks[end].x * width, landmarks[end].y * height)
        ctx.stroke()
      }
    })

    // Draw landmark points
    ctx.fillStyle = '#00ffff'
    landmarks.forEach(landmark => {
      ctx.beginPath()
      ctx.arc(landmark.x * width, landmark.y * height, 3, 0, 2 * Math.PI)
      ctx.fill()
    })
  }

  const triggerSpeechSynthesis = (gesture: string) => {
    if ('speechSynthesis' in globalThis) {
      const utterance = new SpeechSynthesisUtterance(gesture)
      utterance.rate = 1
      utterance.pitch = 1
      utterance.volume = 1
      globalThis.speechSynthesis.speak(utterance)
    }
  }

  return {
    isLoaded,
    currentGesture,
    confidence,
    landmarks,
    error
  }
}