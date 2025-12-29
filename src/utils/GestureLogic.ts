import { HandLandmark } from '../types'

export interface GestureResult {
  gesture: string
  confidence: number
  timestamp: Date
}

export class GestureLogic {
  private gestureHistory: Array<{gesture: string, confidence: number, timestamp: number}> = []
  private readonly HISTORY_SIZE = 5
  private readonly STABILITY_THRESHOLD = 0.6

  detectGesture(landmarks: HandLandmark[]): GestureResult {
    if (!landmarks || landmarks.length < 21) {
      return { gesture: '', confidence: 0, timestamp: new Date() }
    }

    // Test all 12 gestures and return the one with highest confidence
    // Reordered for better priority - Fist detection first for better accuracy
    const gestures = [
      { name: 'Fist', detector: this.isClosedFist.bind(this) },
      { name: 'Thumbs Up', detector: this.isThumbsUp.bind(this) },
      { name: 'No', detector: this.isThumbsDown.bind(this) },
      { name: 'Point Up', detector: this.isPointUp.bind(this) },
      { name: 'Peace', detector: this.isVictory.bind(this) },
      { name: 'OK', detector: this.isOkaySign.bind(this) },
      { name: 'Hello', detector: this.isCallMe.bind(this) },
      { name: 'Help', detector: this.isILoveYou.bind(this) },
      { name: 'Yes', detector: this.isRockOn.bind(this) },
      { name: 'Open Palm', detector: this.isOpenPalm.bind(this) },
      { name: 'Stop', detector: this.isStop.bind(this) },
      { name: 'Thank You', detector: this.isPraying.bind(this) }
    ]

    let bestGesture = ''
    let bestConfidence = 0

    for (const gesture of gestures) {
      const confidence = gesture.detector(landmarks)
      if (confidence > bestConfidence && confidence >= 0.55) { // Further lowered threshold for better responsiveness
        bestGesture = gesture.name
        bestConfidence = confidence
      }
    }

    // Add to history for smoothing
    const now = Date.now()
    this.gestureHistory.push({
      gesture: bestGesture,
      confidence: bestConfidence,
      timestamp: now
    })

    // Keep only recent history
    this.gestureHistory = this.gestureHistory.filter(h => now - h.timestamp < 1200) // Increased to 1.2 seconds for better stability
    if (this.gestureHistory.length > this.HISTORY_SIZE) {
      this.gestureHistory.shift()
    }

    // Apply smoothing - gesture must be stable across multiple frames
    const smoothedResult = this.applySmoothingFilter(bestGesture, bestConfidence)

    return {
      gesture: smoothedResult.gesture,
      confidence: smoothedResult.confidence,
      timestamp: new Date()
    }
  }

  private applySmoothingFilter(currentGesture: string, currentConfidence: number): {gesture: string, confidence: number} {
    if (this.gestureHistory.length < 2) { // Reduced from 3 for faster response
      return { gesture: currentGesture, confidence: currentConfidence }
    }

    // Count occurrences of each gesture in recent history
    const gestureCounts: {[key: string]: {count: number, totalConfidence: number}} = {}
    
    for (const entry of this.gestureHistory) {
      if (entry.gesture && entry.confidence >= 0.4) { // Lowered threshold for inclusion
        if (!gestureCounts[entry.gesture]) {
          gestureCounts[entry.gesture] = { count: 0, totalConfidence: 0 }
        }
        gestureCounts[entry.gesture].count++
        gestureCounts[entry.gesture].totalConfidence += entry.confidence
      }
    }

    // Find most stable gesture with enhanced logic
    let mostStableGesture = ''
    let highestStability = 0

    for (const [gesture, data] of Object.entries(gestureCounts)) {
      const stability = data.count / this.gestureHistory.length
      const avgConfidence = data.totalConfidence / data.count
      
      // Enhanced stability calculation with confidence weighting
      const stabilityScore = stability * avgConfidence * 1.2 // Boost for confidence
      
      // Lower stability threshold for better responsiveness
      if (stabilityScore > highestStability && stability >= 0.4) { // Reduced from 0.6
        mostStableGesture = gesture
        highestStability = stabilityScore
      }
    }

    if (mostStableGesture) {
      const avgConfidence = gestureCounts[mostStableGesture].totalConfidence / gestureCounts[mostStableGesture].count
      
      // Enhanced confidence boost for stable gestures
      const boostedConfidence = Math.min(avgConfidence * 1.15, 1) // Increased boost
      
      return { gesture: mostStableGesture, confidence: boostedConfidence }
    }

    // If no stable gesture found, return current if confidence is decent
    if (currentConfidence >= 0.5) {
      return { gesture: currentGesture, confidence: currentConfidence }
    }

    return { gesture: '', confidence: 0 }
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
      
      // Thumb: check if tip is to the right of IP joint (for right hand) with more tolerance
      const thumbExtended = Math.abs(landmarks[4].x - landmarks[3].x) > 0.02 && landmarks[4].x > landmarks[2].x
      if (thumbExtended) upFingers++
      
      // Other fingers: check if tip is above PIP with better tolerance
      for (let i = 1; i < fingerTips.length; i++) {
        const tipY = landmarks[fingerTips[i]].y
        const pipY = landmarks[fingerPips[i]].y
        const mcpY = landmarks[fingerPips[i] - 1].y // MCP joint
        
        // Finger is up if tip is significantly above PIP and above MCP
        if (tipY < pipY - 0.02 && tipY < mcpY) {
          upFingers++
        }
      }
      
      // Check finger spread for more natural open palm
      const spread = this.calculateFingerSpread(landmarks)
      const fingerScore = upFingers / 5
      const spreadScore = Math.min(spread / 0.12, 1) // Adjusted spread threshold
      
      return Math.min(fingerScore * 0.85 + spreadScore * 0.15, 1)
    } catch {
      return 0
    }
  }

  // 2. Closed Fist ("Fist") -> All fingers down - ENHANCED ALGORITHM
  private isClosedFist(landmarks: HandLandmark[]): number {
    try {
      let fistScore = 0
      
      // Method 1: Enhanced fingertip-to-palm proximity check
      const palmCenter = landmarks[9] // Middle finger MCP (palm center)
      const wrist = landmarks[0] // Wrist reference point
      const fingerTips = [4, 8, 12, 16, 20] // Thumb, Index, Middle, Ring, Pinky
      
      let closeToPalm = 0
      for (const tipIndex of fingerTips) {
        const distanceToPalm = this.getDistance(landmarks[tipIndex], palmCenter)
        const distanceToWrist = this.getDistance(landmarks[tipIndex], wrist)
        
        // Enhanced: Tips should be close to palm AND closer to wrist than extended
        if (distanceToPalm < 0.12 && distanceToWrist < 0.15) { // More forgiving thresholds
          closeToPalm++
        }
      }
      
      const palmProximityScore = closeToPalm / 5
      
      // Method 2: Enhanced MCP comparison with better tolerance
      const fingerMCPs = [2, 5, 9, 13, 17] // MCP joints for each finger
      let belowMCP = 0
      
      for (let i = 0; i < fingerTips.length; i++) {
        const tipY = landmarks[fingerTips[i]].y
        const mcpY = landmarks[fingerMCPs[i]].y
        
        // For fist, fingertips should be at or below MCP level
        if (tipY >= mcpY - 0.03) { // Increased tolerance
          belowMCP++
        }
      }
      
      const mcpScore = belowMCP / 5
      
      // Method 3: Enhanced finger curl analysis
      const fingerPIPs = [3, 6, 10, 14, 18]
      let curledFingers = 0
      
      for (let i = 0; i < fingerTips.length; i++) {
        const tipToWrist = this.getDistance(landmarks[fingerTips[i]], wrist)
        const pipToWrist = this.getDistance(landmarks[fingerPIPs[i]], wrist)
        
        // In a fist, fingertips should be closer to wrist than PIPs
        if (tipToWrist <= pipToWrist + 0.04) { // Increased tolerance
          curledFingers++
        }
      }
      
      const curlScore = curledFingers / 5
      
      // Method 4: NEW - Check finger bend angles
      let bentFingers = 0
      for (let i = 1; i < fingerTips.length; i++) { // Skip thumb for angle check
        const tip = landmarks[fingerTips[i]]
        const pip = landmarks[fingerPIPs[i]]
        const mcp = landmarks[fingerMCPs[i]]
        
        // Calculate angle between MCP-PIP and PIP-TIP vectors
        const vec1 = { x: pip.x - mcp.x, y: pip.y - mcp.y }
        const vec2 = { x: tip.x - pip.x, y: tip.y - pip.y }
        
        const dotProduct = vec1.x * vec2.x + vec1.y * vec2.y
        const mag1 = Math.hypot(vec1.x, vec1.y)
        const mag2 = Math.hypot(vec2.x, vec2.y)
        
        if (mag1 > 0 && mag2 > 0) {
          const cosAngle = dotProduct / (mag1 * mag2)
          const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle))) * (180 / Math.PI)
          
          // In a fist, fingers should be bent (angle < 120 degrees)
          if (angle < 120) {
            bentFingers++
          }
        }
      }
      
      const bendScore = bentFingers / 4 // 4 fingers (excluding thumb)
      
      // Method 5: NEW - Overall hand compactness
      const handSpan = this.getDistance(landmarks[4], landmarks[20]) // Thumb to pinky
      const handHeight = Math.abs(landmarks[12].y - landmarks[0].y) // Middle finger to wrist
      const compactness = handSpan < 0.18 && handHeight < 0.12 ? 1 : 0
      
      // Combine all methods with optimized weights
      fistScore = palmProximityScore * 0.25 + mcpScore * 0.25 + curlScore * 0.25 + bendScore * 0.15 + compactness * 0.1
      
      // Bonus for very compact fist
      if (handSpan < 0.12 && palmProximityScore > 0.8) {
        fistScore += 0.15 // Strong bonus for tight fist
      }
      
      return Math.min(fistScore, 1)
    } catch {
      return 0
    }
  }

  // 3. Thumbs Up ("Thumbs Up") -> Thumb up, others down
  private isThumbsUp(landmarks: HandLandmark[]): number {
    try {
      // More reliable thumb detection
      const thumbUp = landmarks[4].y < landmarks[3].y && landmarks[4].y < landmarks[2].y
      const thumbExtended = this.getDistance(landmarks[4], landmarks[0]) > 0.08
      
      // Check other fingers are down with better tolerance
      const indexDown = landmarks[8].y > landmarks[6].y + 0.02
      const middleDown = landmarks[12].y > landmarks[10].y + 0.02
      const ringDown = landmarks[16].y > landmarks[14].y + 0.02
      const pinkyDown = landmarks[20].y > landmarks[18].y + 0.02
      
      const thumbScore = (thumbUp && thumbExtended) ? 1 : 0
      const othersScore = (Number(indexDown) + Number(middleDown) + Number(ringDown) + Number(pinkyDown)) / 4
      
      return thumbScore * 0.7 + othersScore * 0.3
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
      // More precise finger detection
      const indexUp = landmarks[8].y < landmarks[6].y - 0.03 && landmarks[8].y < landmarks[5].y
      const middleUp = landmarks[12].y < landmarks[10].y - 0.03 && landmarks[12].y < landmarks[9].y
      
      // Check other fingers are down
      const ringDown = landmarks[16].y > landmarks[14].y + 0.02
      const pinkyDown = landmarks[20].y > landmarks[18].y + 0.02
      const thumbDown = this.getDistance(landmarks[4], landmarks[0]) < 0.08
      
      const upScore = (Number(indexUp) + Number(middleUp)) / 2
      const downScore = (Number(ringDown) + Number(pinkyDown) + Number(thumbDown)) / 3
      
      // Check separation between index and middle (V shape)
      const separation = Math.abs(landmarks[8].x - landmarks[12].x)
      const separationScore = Math.min(separation / 0.06, 1) // Adjusted for better V detection
      
      return upScore * 0.5 + downScore * 0.3 + separationScore * 0.2
    } catch {
      return 0
    }
  }

  // 6. Point Up ("Point Up") -> Index up, others down
  private isPointUp(landmarks: HandLandmark[]): number {
    try {
      // More precise index finger detection
      const indexUp = landmarks[8].y < landmarks[6].y - 0.03 && landmarks[8].y < landmarks[5].y
      const indexExtended = this.getDistance(landmarks[8], landmarks[0]) > 0.1
      
      // Check other fingers are down
      const middleDown = landmarks[12].y > landmarks[10].y + 0.02
      const ringDown = landmarks[16].y > landmarks[14].y + 0.02
      const pinkyDown = landmarks[20].y > landmarks[18].y + 0.02
      const thumbDown = this.getDistance(landmarks[4], landmarks[0]) < 0.08
      
      const indexScore = (indexUp && indexExtended) ? 1 : 0
      const othersScore = (Number(middleDown) + Number(ringDown) + Number(pinkyDown) + Number(thumbDown)) / 4
      
      // Check if pointing upward (not sideways)
      const pointingUp = landmarks[8].y < landmarks[5].y - 0.05
      const directionScore = pointingUp ? 1 : 0.5
      
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
      
      // More forgiving distance threshold
      const closeEnough = distance < 0.08
      const proximityScore = closeEnough ? 1 : Math.max(0, 1 - distance / 0.12)
      
      // Check other fingers are up with better tolerance
      const middleUp = landmarks[12].y < landmarks[10].y - 0.02
      const ringUp = landmarks[16].y < landmarks[14].y - 0.02
      const pinkyUp = landmarks[20].y < landmarks[18].y - 0.02
      
      const othersScore = (Number(middleUp) + Number(ringUp) + Number(pinkyUp)) / 3
      
      // Bonus for circular shape (thumb and index forming circle)
      const circleBonus = (distance < 0.06 && distance > 0.02) ? 0.2 : 0
      
      return Math.min(proximityScore * 0.6 + othersScore * 0.4 + circleBonus, 1)
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

  // 12. Praying ("Thank You") -> Open Palm with specific positioning
  private isPraying(landmarks: HandLandmark[]): number {
    try {
      // Enhanced Thank You detection - multiple methods
      
      // Method 1: Check if it's an open palm
      const openPalmScore = this.isOpenPalm(landmarks)
      
      // Method 2: Check hand position (center of screen, moderate height)
      const wrist = landmarks[0]
      
      // Hand should be in center-ish area (not too far left/right)
      const centerScore = (wrist.x > 0.3 && wrist.x < 0.7) ? 1 : 0.5
      
      // Method 3: Check vertical positioning (not too high, not too low)
      const heightScore = (wrist.y > 0.4 && wrist.y < 0.8) ? 1 : 0.5
      
      // Method 4: Check palm orientation (palm should face camera)
      const palmNormal = this.calculatePalmNormal(landmarks)
      const facingCamera = Math.abs(palmNormal.z) > 0.3 ? 1 : 0.5
      
      // Method 5: Check finger alignment (fingers should point upward)
      const fingersUp = landmarks[8].y < landmarks[6].y && 
                       landmarks[12].y < landmarks[10].y && 
                       landmarks[16].y < landmarks[14].y && 
                       landmarks[20].y < landmarks[18].y
      const alignmentScore = fingersUp ? 1 : 0.3
      
      // Combine all factors
      const thankYouScore = openPalmScore * 0.4 + centerScore * 0.15 + heightScore * 0.15 + facingCamera * 0.15 + alignmentScore * 0.15
      
      return Math.min(thankYouScore, 1)
    } catch {
      return 0
    }
  }

  // Helper: Calculate palm normal vector for orientation
  private calculatePalmNormal(landmarks: HandLandmark[]): {x: number, y: number, z: number} {
    try {
      // Use three points to calculate normal: wrist, index MCP, pinky MCP
      const wrist = landmarks[0]
      const indexMCP = landmarks[5]
      const pinkyMCP = landmarks[17]
      
      // Calculate two vectors
      const v1 = { x: indexMCP.x - wrist.x, y: indexMCP.y - wrist.y, z: (indexMCP.z || 0) - (wrist.z || 0) }
      const v2 = { x: pinkyMCP.x - wrist.x, y: pinkyMCP.y - wrist.y, z: (pinkyMCP.z || 0) - (wrist.z || 0) }
      
      // Cross product to get normal
      const normal = {
        x: v1.y * v2.z - v1.z * v2.y,
        y: v1.z * v2.x - v1.x * v2.z,
        z: v1.x * v2.y - v1.y * v2.x
      }
      
      // Normalize
      const magnitude = Math.hypot(normal.x, normal.y, normal.z)
      if (magnitude > 0) {
        return {
          x: normal.x / magnitude,
          y: normal.y / magnitude,
          z: normal.z / magnitude
        }
      }
      
      return { x: 0, y: 0, z: 1 } // Default facing camera
    } catch {
      return { x: 0, y: 0, z: 1 }
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