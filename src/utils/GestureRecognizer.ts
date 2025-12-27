import { HandLandmark, GestureResult } from '../types'

export class GestureRecognizer {
  detectGesture(landmarks: HandLandmark[]): GestureResult {
    
    // Test each gesture and return the one with highest confidence
    const gestures = [
      { name: 'Hello/Hi', detector: this.isOpenPalm.bind(this) },
      { name: 'Yes', detector: this.isClosedFist.bind(this) },
      { name: 'No', detector: this.isThumbsDown.bind(this) },
      { name: 'Peace/Victory', detector: this.isPeaceSign.bind(this) },
      { name: 'I have a question', detector: this.isPointingUp.bind(this) }
    ]

    let bestGesture = ''
    let bestConfidence = 0

    for (const gesture of gestures) {
      const confidence = gesture.detector(landmarks)
      if (confidence > bestConfidence && confidence >= 0.6) {
        bestGesture = gesture.name
        bestConfidence = confidence
      }
    }

    return {
      gesture: bestGesture,
      confidence: bestConfidence,
      landmarks,
      timestamp: new Date()
    }
  }

  private isOpenPalm(landmarks: HandLandmark[]): number {
    if (!landmarks || landmarks.length < 21) return 0

    try {
      // Check if all fingertips are above their respective PIP joints
      const fingerTips = [4, 8, 12, 16, 20] // Thumb, Index, Middle, Ring, Pinky tips
      const fingerPIPs = [3, 6, 10, 14, 18] // Corresponding PIP joints
      
      let extendedFingers = 0
      
      // For thumb, check if tip is to the right of IP joint (different logic)
      if (landmarks[4].x > landmarks[3].x) {
        extendedFingers++
      }
      
      // For other fingers, check if tip is above PIP joint
      for (let i = 1; i < fingerTips.length; i++) {
        if (landmarks[fingerTips[i]].y < landmarks[fingerPIPs[i]].y) {
          extendedFingers++
        }
      }
      
      // Check finger spread (distance between fingertips)
      const spread = this.calculateFingerSpread(landmarks)
      
      // Open palm: all fingers extended + good spread
      const fingerScore = extendedFingers / 5
      const spreadScore = Math.min(spread / 0.3, 1) // Normalize spread
      
      return (fingerScore * 0.7 + spreadScore * 0.3)
    } catch (error) {
      return 0
    }
  }

  private isClosedFist(landmarks: HandLandmark[]): number {
    if (!landmarks || landmarks.length < 21) return 0

    try {
      // Check if all fingertips are below their respective PIP joints
      const fingerTips = [4, 8, 12, 16, 20]
      const fingerPIPs = [3, 6, 10, 14, 18]
      
      let closedFingers = 0
      
      // For thumb, check if tip is to the left of IP joint
      if (landmarks[4].x < landmarks[3].x) {
        closedFingers++
      }
      
      // For other fingers, check if tip is below PIP joint
      for (let i = 1; i < fingerTips.length; i++) {
        if (landmarks[fingerTips[i]].y > landmarks[fingerPIPs[i]].y) {
          closedFingers++
        }
      }
      
      // Closed fist: all fingers closed
      return closedFingers / 5
    } catch (error) {
      return 0
    }
  }

  private isThumbsDown(landmarks: HandLandmark[]): number {
    if (!landmarks || landmarks.length < 21) return 0

    try {
      // Thumb pointing down: thumb tip below thumb IP joint
      const thumbDown = landmarks[4].y > landmarks[3].y
      
      // Other fingers should be closed
      const fingerTips = [8, 12, 16, 20]
      const fingerPIPs = [6, 10, 14, 18]
      
      let closedFingers = 0
      for (let i = 0; i < fingerTips.length; i++) {
        if (landmarks[fingerTips[i]].y > landmarks[fingerPIPs[i]].y) {
          closedFingers++
        }
      }
      
      const thumbScore = thumbDown ? 1 : 0
      const fingersScore = closedFingers / 4
      
      return (thumbScore * 0.6 + fingersScore * 0.4)
    } catch (error) {
      return 0
    }
  }

  private isPeaceSign(landmarks: HandLandmark[]): number {
    if (!landmarks || landmarks.length < 21) return 0

    try {
      // Index and middle fingers extended, others closed
      const indexExtended = landmarks[8].y < landmarks[6].y
      const middleExtended = landmarks[12].y < landmarks[10].y
      
      // Ring and pinky should be closed
      const ringClosed = landmarks[16].y > landmarks[14].y
      const pinkyClosed = landmarks[20].y > landmarks[18].y
      
      // Thumb can be either way
      const extendedCount = (indexExtended ? 1 : 0) + (middleExtended ? 1 : 0)
      const closedCount = (ringClosed ? 1 : 0) + (pinkyClosed ? 1 : 0)
      
      // Check separation between index and middle finger
      const separation = Math.abs(landmarks[8].x - landmarks[12].x)
      const separationScore = Math.min(separation / 0.1, 1)
      
      const gestureScore = (extendedCount / 2) * (closedCount / 2)
      
      return gestureScore * 0.7 + separationScore * 0.3
    } catch (error) {
      return 0
    }
  }

  private isPointingUp(landmarks: HandLandmark[]): number {
    if (!landmarks || landmarks.length < 21) return 0

    try {
      // Only index finger extended, others closed
      const indexExtended = landmarks[8].y < landmarks[6].y
      
      // Other fingers should be closed
      const middleClosed = landmarks[12].y > landmarks[10].y
      const ringClosed = landmarks[16].y > landmarks[14].y
      const pinkyClosed = landmarks[20].y > landmarks[18].y
      const thumbClosed = landmarks[4].x < landmarks[3].x
      
      const extendedScore = indexExtended ? 1 : 0
      const closedCount = (middleClosed ? 1 : 0) + (ringClosed ? 1 : 0) + 
                         (pinkyClosed ? 1 : 0) + (thumbClosed ? 1 : 0)
      const closedScore = closedCount / 4
      
      // Check if index finger is pointing upward (not sideways)
      const pointingUp = landmarks[8].y < landmarks[5].y // Tip above MCP joint
      const directionScore = pointingUp ? 1 : 0
      
      return extendedScore * 0.4 + closedScore * 0.4 + directionScore * 0.2
    } catch (error) {
      return 0
    }
  }

  private calculateFingerSpread(landmarks: HandLandmark[]): number {
    // Calculate average distance between adjacent fingertips
    const tips = [8, 12, 16, 20] // Index, Middle, Ring, Pinky
    let totalDistance = 0
    
    for (let i = 0; i < tips.length - 1; i++) {
      const dx = landmarks[tips[i]].x - landmarks[tips[i + 1]].x
      const dy = landmarks[tips[i]].y - landmarks[tips[i + 1]].y
      totalDistance += Math.sqrt(dx * dx + dy * dy)
    }
    
    return totalDistance / (tips.length - 1)
  }
}