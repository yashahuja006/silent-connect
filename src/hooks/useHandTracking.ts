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

    // Shorter timeout for demo
    initializationTimeout.current = window.setTimeout(() => {
      if (!isLoaded) {
        console.log('MediaPipe timeout - this is normal, using demo mode')
        setError('MediaPipe loading timeout - using demo mode')
      }
    }, 8000) // Reduced to 8 seconds

    const initializeHandTracking = async () => {
      try {
        console.log('Loading MediaPipe for demo...')
        
        // Try multiple CDN sources for better reliability
        const loadMediaPipe = async () => {
          try {
            // Use the original npm imports
            const [{ Hands }, { Camera }] = await Promise.all([
              import('@mediapipe/hands'),
              import('@mediapipe/camera_utils')
            ])
            return { Hands, Camera }
          } catch (e) {
            console.log('MediaPipe import failed:', e)
            throw e
          }
        }

        const { Hands, Camera } = await loadMediaPipe()
        console.log('MediaPipe loaded successfully!')
        
        const hands = new Hands({
          locateFile: (file: string) => {
            // Try multiple CDN sources
            const cdns = [
              `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`,
              `https://unpkg.com/@mediapipe/hands@0.4.1646424915/${file}`
            ]
            return cdns[0] // Use primary first
          }
        })

        // Optimized settings for demo
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 0, // Fastest model
          minDetectionConfidence: 0.6, // Lower for easier detection
          minTrackingConfidence: 0.4,
          selfieMode: true // Better for webcam
        })

        hands.onResults(onResults)
        handsRef.current = hands

        // Initialize camera
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
          
          // Clear timeout on success
          if (initializationTimeout.current) {
            clearTimeout(initializationTimeout.current)
          }
          
          setIsLoaded(true)
          setError(null)
          console.log('🎉 MediaPipe ready for demo!')
        }
        
      } catch (err) {
        console.error('MediaPipe failed:', err)
        setError(`MediaPipe failed to load. Using demo mode instead.`)
        
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
          visibility: landmark.visibility || 1
        }))

        setLandmarks(convertedLandmarks)

        // Draw hand landmarks and connections
        drawHandLandmarks(ctx, convertedLandmarks, canvas.width, canvas.height)

        // Recognize gesture
        const gestureResult = gestureRecognizer.current.detectGesture(convertedLandmarks)
        
        if (gestureResult.gesture && gestureResult.confidence >= 0.6) { // Lowered threshold
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
      
      // Shorter hold time for demo
      const holdDuration = 1000 // 1 second instead of 1.5
      
      if (gestureResult.gesture === currentGesture) {
        if (gestureHoldStart.current === 0) {
          gestureHoldStart.current = now
        }
        
        if (now - gestureHoldStart.current >= holdDuration && 
            lastTriggeredGesture.current !== gestureResult.gesture) {
          triggerSpeechSynthesis(gestureResult.gesture)
          lastTriggeredGesture.current = gestureResult.gesture
        }
      } else {
        gestureHoldStart.current = 0
        lastTriggeredGesture.current = null
      }
      
      setCurrentGesture(gestureResult.gesture)
      setConfidence(gestureResult.confidence)
      lastGestureTime.current = now
    }

    const handleNoGesture = () => {
      if (Date.now() - lastGestureTime.current > 300) { // Faster reset
        setCurrentGesture(null)
        setConfidence(0)
        gestureHoldStart.current = 0
        lastTriggeredGesture.current = null
      }
    }

    const handleNoHands = () => {
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
    // Brighter, thicker lines for demo video
    ctx.strokeStyle = '#00ff80'
    ctx.lineWidth = 3
    ctx.shadowColor = '#00ff80'
    ctx.shadowBlur = 5

    // Simplified connections for better visibility
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // Index
      [0, 9], [9, 10], [10, 11], [11, 12], // Middle
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring
      [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
      [5, 9], [9, 13], [13, 17] // Palm
    ]

    connections.forEach(([start, end]) => {
      if (landmarks[start] && landmarks[end]) {
        ctx.beginPath()
        ctx.moveTo(landmarks[start].x * width, landmarks[start].y * height)
        ctx.lineTo(landmarks[end].x * width, landmarks[end].y * height)
        ctx.stroke()
      }
    })

    // Larger, brighter points for demo
    ctx.fillStyle = '#00ffff'
    ctx.shadowColor = '#00ffff'
    landmarks.forEach(landmark => {
      ctx.beginPath()
      ctx.arc(landmark.x * width, landmark.y * height, 4, 0, 2 * Math.PI)
      ctx.fill()
    })
    
    ctx.shadowBlur = 0 // Reset shadow
  }

  const triggerSpeechSynthesis = (gesture: string) => {
    if ('speechSynthesis' in globalThis) {
      // Clear any existing speech
      globalThis.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(gesture)
      utterance.rate = 1.2 // Slightly faster for demo
      utterance.pitch = 1
      utterance.volume = 1
      
      // Add a small delay to ensure it's heard clearly
      setTimeout(() => {
        globalThis.speechSynthesis.speak(utterance)
      }, 100)
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