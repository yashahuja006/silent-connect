import { HandLandmark } from '../types'

export interface GestureResult {
  gesture: string
  confidence: number
  timestamp: Date
}

export class GestureLogic {
  detectGesture(landmarks: HandLandmark[]): GestureResult {
    if (!landmarks || landmarks.length < 21) {
      return { gesture: '', confidence: 0, timestamp: new Date() }
    }

    // Test all 12 gestures and return the one with highest confidence
    const gestures = [
      { name: 'Open Palm', detector: this.isOpenPalm.bind(this) },
      { name: 'Fist', detector: this.isClosedFist.bind(this) },
      { name: 'Thumbs Up', detector: this.isThumbsUp.bind(this) },
      { name: 'No', detector: this.isThumbsDown.bind(this) },
      { name: 'Peace', detector: this.isVictory.bind(this) },
      { name: 'Point Up', detector: this.isPointUp.bind(this) },
      { name: 'Hello', detector: this.isCallMe.bind(this) },
      { name: 'Help', detector: this.isILoveYou.bind(this) },
      { name: 'Yes', detector: this.isRockOn.bind(this) },
      { name: 'OK', detector: this.isOkaySign.bind(this) },
      { name: 'Stop', detector: this.isStop.bind(this) },
      { name: 'Thank You', detector: this.isPraying.bind(this) }
    ]

    let bestGesture = ''
    let bestConfidence = 0

    for (const gesture of gestures) {
      const confidence = gesture.detector(landmarks)
      if (confidence > bestConfidence && confidence >= 0.65) {
        bestGesture = gesture.name
        bestConfidence = confidence
      }
    }

    return {
      gesture: bestGesture,
      confidence: bestConfidence,
      timestamp: new Date()
    }
  }

  // Helper function to check if finger is up (tip.y < pip.y)
  private isFingerUp(landmarks: HandLandmark[], tipIndex: number, pipIndex: number): boolean {
    return landmarks[tipIndex].y < landmarks[pipIndex].y
  }

  // Helper function to calculate distance between two points
  private getDistance(p1: HandLandmark, p2: HandLandmark): number {
    const dx = p1.x - p2.x
    const dy = p1.y - p2.y
    return Math.hypot(dx, dy)
  }

  // 1. Open Palm ("Open Palm") -> All fingers up
  private isOpenPalm(landmarks: HandLandmark[]): number {
    try {
      const fingerTips = [4, 8, 12, 16, 20] // Thumb, Index, Middle, Ring, Pinky
      const fingerPips = [3, 6, 10, 14, 18]
      
      let upFingers = 0
      
      // Thumb: check if tip is to the right of IP joint (for right hand)
      if (landmarks[4].x > landmarks[3].x) upFingers++
      
      // Other fingers: check if tip is above PIP
      for (let i = 1; i < fingerTips.length; i++) {
        if (this.isFingerUp(landmarks, fingerTips[i], fingerPips[i])) {
          upFingers++
        }
      }
      
      // Check finger spread
      const spread = this.calculateFingerSpread(landmarks)
      const fingerScore = upFingers / 5
      const spreadScore = Math.min(spread / 0.15, 1)
      
      return Math.min(fingerScore * 0.8 + spreadScore * 0.2, 1)
    } catch {
      return 0
    }
  }

  // 2. Closed Fist ("Fist") -> All fingers down
  private isClosedFist(landmarks: HandLandmark[]): number {
    try {
      const fingerTips = [4, 8, 12, 16, 20]
      const fingerPips = [3, 6, 10, 14, 18]
      
      let downFingers = 0
      
      // Thumb: check if tip is to the left of IP joint
      if (landmarks[4].x < landmarks[3].x) downFingers++
      
      // Other fingers: check if tip is below PIP
      for (let i = 1; i < fingerTips.length; i++) {
        if (!this.isFingerUp(landmarks, fingerTips[i], fingerPips[i])) {
          downFingers++
        }
      }
      
      return downFingers / 5
    } catch {
      return 0
    }
  }

  // 3. Thumbs Up ("Thumbs Up") -> Thumb up, others down
  private isThumbsUp(landmarks: HandLandmark[]): number {
    try {
      const thumbUp = landmarks[4].y < landmarks[3].y
      const indexDown = !this.isFingerUp(landmarks, 8, 6)
      const middleDown = !this.isFingerUp(landmarks, 12, 10)
      const ringDown = !this.isFingerUp(landmarks, 16, 14)
      const pinkyDown = !this.isFingerUp(landmarks, 20, 18)
      
      const thumbScore = thumbUp ? 1 : 0
      const othersScore = (Number(indexDown) + Number(middleDown) + Number(ringDown) + Number(pinkyDown)) / 4
      
      return thumbScore * 0.6 + othersScore * 0.4
    } catch {
      return 0
    }
  }

  // 4. Thumbs Down ("No") -> Thumb down, others down
  private isThumbsDown(landmarks: HandLandmark[]): number {
    try {
      const thumbDown = landmarks[4].y > landmarks[3].y
      const indexDown = !this.isFingerUp(landmarks, 8, 6)
      const middleDown = !this.isFingerUp(landmarks, 12, 10)
      const ringDown = !this.isFingerUp(landmarks, 16, 14)
      const pinkyDown = !this.isFingerUp(landmarks, 20, 18)
      
      const thumbScore = thumbDown ? 1 : 0
      const othersScore = (Number(indexDown) + Number(middleDown) + Number(ringDown) + Number(pinkyDown)) / 4
      
      return thumbScore * 0.7 + othersScore * 0.3
    } catch {
      return 0
    }
  }

  // 5. Victory ("Peace") -> Index & Middle up, others down
  private isVictory(landmarks: HandLandmark[]): number {
    try {
      const indexUp = this.isFingerUp(landmarks, 8, 6)
      const middleUp = this.isFingerUp(landmarks, 12, 10)
      const ringDown = !this.isFingerUp(landmarks, 16, 14)
      const pinkyDown = !this.isFingerUp(landmarks, 20, 18)
      
      const upScore = (Number(indexUp) + Number(middleUp)) / 2
      const downScore = (Number(ringDown) + Number(pinkyDown)) / 2
      
      // Check separation between index and middle
      const separation = Math.abs(landmarks[8].x - landmarks[12].x)
      const separationScore = Math.min(separation / 0.08, 1)
      
      return upScore * 0.5 + downScore * 0.3 + separationScore * 0.2
    } catch {
      return 0
    }
  }

  // 6. Point Up ("Point Up") -> Index up, others down
  private isPointUp(landmarks: HandLandmark[]): number {
    try {
      const indexUp = this.isFingerUp(landmarks, 8, 6)
      const middleDown = !this.isFingerUp(landmarks, 12, 10)
      const ringDown = !this.isFingerUp(landmarks, 16, 14)
      const pinkyDown = !this.isFingerUp(landmarks, 20, 18)
      const thumbDown = landmarks[4].x < landmarks[3].x
      
      const indexScore = indexUp ? 1 : 0
      const othersScore = (Number(middleDown) + Number(ringDown) + Number(pinkyDown) + Number(thumbDown)) / 4
      
      // Check if pointing upward
      const pointingUp = landmarks[8].y < landmarks[5].y
      const directionScore = pointingUp ? 1 : 0
      
      return indexScore * 0.5 + othersScore * 0.3 + directionScore * 0.2
    } catch {
      return 0
    }
  }

  // 7. Call Me ("Hello") -> Thumb & Pinky up
  private isCallMe(landmarks: HandLandmark[]): number {
    try {
      const thumbUp = landmarks[4].y < landmarks[3].y
      const pinkyUp = this.isFingerUp(landmarks, 20, 18)
      const indexDown = !this.isFingerUp(landmarks, 8, 6)
      const middleDown = !this.isFingerUp(landmarks, 12, 10)
      const ringDown = !this.isFingerUp(landmarks, 16, 14)
      
      const upScore = (Number(thumbUp) + Number(pinkyUp)) / 2
      const downScore = (Number(indexDown) + Number(middleDown) + Number(ringDown)) / 3
      
      return upScore * 0.7 + downScore * 0.3
    } catch {
      return 0
    }
  }

  // 8. I Love You ("Help") -> Thumb, Index, Pinky up
  private isILoveYou(landmarks: HandLandmark[]): number {
    try {
      const thumbUp = landmarks[4].y < landmarks[3].y
      const indexUp = this.isFingerUp(landmarks, 8, 6)
      const pinkyUp = this.isFingerUp(landmarks, 20, 18)
      const middleDown = !this.isFingerUp(landmarks, 12, 10)
      const ringDown = !this.isFingerUp(landmarks, 16, 14)
      
      const upScore = (Number(thumbUp) + Number(indexUp) + Number(pinkyUp)) / 3
      const downScore = (Number(middleDown) + Number(ringDown)) / 2
      
      return upScore * 0.7 + downScore * 0.3
    } catch {
      return 0
    }
  }

  // 9. Rock On ("Yes") -> Index & Pinky up
  private isRockOn(landmarks: HandLandmark[]): number {
    try {
      const indexUp = this.isFingerUp(landmarks, 8, 6)
      const pinkyUp = this.isFingerUp(landmarks, 20, 18)
      const middleDown = !this.isFingerUp(landmarks, 12, 10)
      const ringDown = !this.isFingerUp(landmarks, 16, 14)
      const thumbDown = landmarks[4].x < landmarks[3].x
      
      const upScore = (Number(indexUp) + Number(pinkyUp)) / 2
      const downScore = (Number(middleDown) + Number(ringDown) + Number(thumbDown)) / 3
      
      return upScore * 0.6 + downScore * 0.4
    } catch {
      return 0
    }
  }

  // 10. Okay Sign ("OK") -> Index & Thumb tips close, others up
  private isOkaySign(landmarks: HandLandmark[]): number {
    try {
      const thumbTip = landmarks[4]
      const indexTip = landmarks[8]
      const distance = this.getDistance(thumbTip, indexTip)
      
      const closeEnough = distance < 0.05
      const middleUp = this.isFingerUp(landmarks, 12, 10)
      const ringUp = this.isFingerUp(landmarks, 16, 14)
      const pinkyUp = this.isFingerUp(landmarks, 20, 18)
      
      const proximityScore = closeEnough ? 1 : Math.max(0, 1 - distance / 0.1)
      const othersScore = (Number(middleUp) + Number(ringUp) + Number(pinkyUp)) / 3
      
      return proximityScore * 0.7 + othersScore * 0.3
    } catch {
      return 0
    }
  }

  // 11. Stop ("Stop") -> Open palm but fingers tight together
  private isStop(landmarks: HandLandmark[]): number {
    try {
      const fingerTips = [8, 12, 16, 20] // Index, Middle, Ring, Pinky
      const fingerPips = [6, 10, 14, 18]
      
      let upFingers = 0
      for (let i = 0; i < fingerTips.length; i++) {
        if (this.isFingerUp(landmarks, fingerTips[i], fingerPips[i])) {
          upFingers++
        }
      }
      
      // Check if fingers are close together (tight)
      const spread = this.calculateFingerSpread(landmarks)
      const fingerScore = upFingers / 4
      const tightScore = spread < 0.08 ? 1 : 0 // Very tight fingers
      
      return fingerScore * 0.6 + tightScore * 0.4
    } catch {
      return 0
    }
  }

  // 12. Praying ("Thank You") -> Open Palm at chest level (Wrist Y > 0.7)
  private isPraying(landmarks: HandLandmark[]): number {
    try {
      const wristY = landmarks[0].y
      const atChestLevel = wristY > 0.7
      
      // Check if it's an open palm
      const openPalmScore = this.isOpenPalm(landmarks)
      const positionScore = atChestLevel ? 1 : 0
      
      return openPalmScore * 0.7 + positionScore * 0.3
    } catch {
      return 0
    }
  }

  // Helper: Calculate finger spread
  private calculateFingerSpread(landmarks: HandLandmark[]): number {
    const tips = [8, 12, 16, 20] // Index, Middle, Ring, Pinky
    let totalDistance = 0
    
    for (let i = 0; i < tips.length - 1; i++) {
      totalDistance += this.getDistance(landmarks[tips[i]], landmarks[tips[i + 1]])
    }
    
    return totalDistance / (tips.length - 1)
  }
}