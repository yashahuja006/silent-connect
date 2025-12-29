import React, { useState, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity, Heart, TrendingUp, Target, AlertCircle, CheckCircle } from 'lucide-react'

interface RehabDashboardProps {
  landmarks: any[] | null
  currentGesture: string | null
  confidence: number
}

interface HealthMetrics {
  timestamp: number
  stability: number
  rangeOfMotion: number
}

interface StabilityData {
  time: string
  stability: number
}

const RehabDashboard: React.FC<RehabDashboardProps> = ({ landmarks, currentGesture, confidence }) => {
  const [healthData, setHealthData] = useState<StabilityData[]>([])
  const [currentMetrics, setCurrentMetrics] = useState({
    maxRangeOfMotion: 0,
    currentStability: 0,
    averageStability: 0,
    sessionDuration: 0
  })

  // Store last 10 wrist positions for stability calculation
  const wristHistory = useRef<Array<{x: number, y: number, timestamp: number}>>([])
  const sessionStartTime = useRef<number>(Date.now())

  // Calculate Range of Motion (distance between Wrist and Middle Finger Tip)
  const calculateRangeOfMotion = (landmarks: any[]) => {
    if (!landmarks || landmarks.length < 21) return 0
    
    const wrist = landmarks[0] // Wrist landmark
    const middleFingerTip = landmarks[12] // Middle finger tip
    
    const distance = Math.sqrt(
      Math.pow(middleFingerTip.x - wrist.x, 2) + 
      Math.pow(middleFingerTip.y - wrist.y, 2)
    )
    
    return distance
  }

  // Calculate Stability Score (inverse of wrist position variance) - ENHANCED
  const calculateStability = () => {
    if (wristHistory.current.length < 3) {
      // Return a baseline stability for initial measurements
      return wristHistory.current.length > 0 ? 50 : 0
    }
    
    const positions = wristHistory.current.slice(-10) // Last 10 positions
    
    if (positions.length < 3) return 50 // Baseline stability
    
    // Calculate variance in X and Y positions
    const avgX = positions.reduce((sum, pos) => sum + pos.x, 0) / positions.length
    const avgY = positions.reduce((sum, pos) => sum + pos.y, 0) / positions.length
    
    const varianceX = positions.reduce((sum, pos) => sum + Math.pow(pos.x - avgX, 2), 0) / positions.length
    const varianceY = positions.reduce((sum, pos) => sum + Math.pow(pos.y - avgY, 2), 0) / positions.length
    
    const totalVariance = Math.sqrt(varianceX + varianceY)
    
    // Enhanced stability calculation with better scaling
    // Lower variance = higher stability
    const rawStability = Math.max(0, 1 - (totalVariance * 100)) // Adjusted multiplier for better sensitivity
    const stabilityScore = rawStability * 100
    
    // Ensure we return a reasonable value between 0-100
    const finalScore = Math.max(10, Math.min(100, stabilityScore)) // Minimum 10% for active tracking
    
    return finalScore
  }

  // Update metrics when landmarks change
  useEffect(() => {
    if (landmarks && landmarks.length >= 21) {
      const now = Date.now()
      const wrist = landmarks[0]
      
      // Ensure wrist coordinates are valid
      if (wrist && typeof wrist.x === 'number' && typeof wrist.y === 'number') {
        // Update wrist history
        wristHistory.current.push({
          x: wrist.x,
          y: wrist.y,
          timestamp: now
        })
        
        // Keep only last 15 positions for better stability calculation
        if (wristHistory.current.length > 15) {
          wristHistory.current.shift()
        }
        
        // Calculate current metrics
        const rangeOfMotion = calculateRangeOfMotion(landmarks)
        const stability = calculateStability()
        
        // Debug logging (remove in production)
        if (wristHistory.current.length % 10 === 0) {
          console.log('Health Analytics Debug:', {
            wristPositions: wristHistory.current.length,
            currentStability: stability,
            rangeOfMotion: rangeOfMotion * 100
          })
        }
        
        // Update current metrics with better averaging
        setCurrentMetrics(prev => {
          const newAverage = prev.averageStability === 0 
            ? stability 
            : (prev.averageStability * 0.9 + stability * 0.1) // Weighted average for smoother updates
          
          return {
            maxRangeOfMotion: Math.max(prev.maxRangeOfMotion, rangeOfMotion),
            currentStability: Math.round(stability * 10) / 10, // Round to 1 decimal
            averageStability: Math.round(newAverage * 10) / 10,
            sessionDuration: Math.floor((now - sessionStartTime.current) / 1000)
          }
        })
        
        // Add to chart data (every 1 second instead of every frame)
        const shouldAddToChart = wristHistory.current.length % 5 === 0 // Every 5th update
        
        if (shouldAddToChart) {
          const timeString = new Date(now).toLocaleTimeString('en-US', { 
            hour12: false, 
            minute: '2-digit', 
            second: '2-digit' 
          })
          
          setHealthData(prev => {
            const newData = [...prev, {
              time: timeString,
              stability: Math.round(stability)
            }]
            
            // Keep only last 30 data points for better visualization
            return newData.slice(-30)
          })
        }
      }
    }
  }, [landmarks])

  const MetricCard = ({ 
    title, 
    value, 
    unit, 
    icon: Icon, 
    color, 
    description,
    status 
  }: {
    title: string
    value: number
    unit: string
    icon: any
    color: string
    description: string
    status?: 'good' | 'warning' | 'poor'
  }) => (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-600/30 rounded-lg p-4 hover:border-cyan-500/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {status && (
          <div className="flex items-center space-x-1">
            {status === 'good' && <CheckCircle className="w-4 h-4 text-green-400" />}
            {status === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-400" />}
            {status === 'poor' && <AlertCircle className="w-4 h-4 text-red-400" />}
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <div className="text-2xl font-bold text-white">
          {typeof value === 'number' ? value.toFixed(1) : value}
          <span className="text-sm text-gray-400 ml-1">{unit}</span>
        </div>
        <div className="text-sm font-medium text-gray-300">{title}</div>
      </div>
      
      <div className="text-xs text-gray-400">{description}</div>
    </div>
  )

  const getStabilityStatus = (stability: number) => {
    if (stability >= 80) return 'good'
    if (stability >= 60) return 'warning'
    return 'poor'
  }

  const getRangeStatus = (range: number) => {
    if (range >= 0.3) return 'good'
    if (range >= 0.2) return 'warning'
    return 'poor'
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-cyan-500/30 rounded-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-400/30">
          <Activity className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-cyan-400">Rehabilitation Analytics</h2>
          <p className="text-sm text-gray-400">Real-time hand therapy monitoring</p>
        </div>
      </div>

      {/* Current Session Info */}
      <div className="mb-4 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-red-400" />
            <span className="text-sm text-blue-300">
              Session Duration: <span className="font-bold">{Math.floor(currentMetrics.sessionDuration / 60)}m {currentMetrics.sessionDuration % 60}s</span>
            </span>
          </div>
          {currentGesture && (
            <span className="text-xs text-green-400">
              Current: {currentGesture} ({Math.round(confidence * 100)}%)
            </span>
          )}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Max Range of Motion"
          value={currentMetrics.maxRangeOfMotion * 100}
          unit="cm"
          icon={TrendingUp}
          color="bg-gradient-to-r from-blue-500 to-cyan-500"
          description="Maximum hand extension achieved"
          status={getRangeStatus(currentMetrics.maxRangeOfMotion)}
        />
        
        <MetricCard
          title="Current Stability"
          value={currentMetrics.currentStability}
          unit="%"
          icon={Target}
          color="bg-gradient-to-r from-green-500 to-emerald-500"
          description="Real-time hand steadiness"
          status={getStabilityStatus(currentMetrics.currentStability)}
        />
        
        <MetricCard
          title="Average Stability"
          value={currentMetrics.averageStability}
          unit="%"
          icon={Activity}
          color="bg-gradient-to-r from-purple-500 to-pink-500"
          description="Session average stability"
          status={getStabilityStatus(currentMetrics.averageStability)}
        />
        
        <MetricCard
          title="Active Gestures"
          value={healthData.length}
          unit="samples"
          icon={Heart}
          color="bg-gradient-to-r from-orange-500 to-red-500"
          description="Data points collected"
        />
      </div>

      {/* Real-time Stability Chart */}
      <div className="flex-1 bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-200">Hand Stability Over Time</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400">Live Data</span>
          </div>
        </div>
        
        {healthData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={healthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => value.split(':').slice(1).join(':')}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
                formatter={(value: any) => [`${value}%`, 'Stability']}
              />
              <Line 
                type="monotone" 
                dataKey="stability" 
                stroke="#06B6D4" 
                strokeWidth={2}
                dot={{ fill: '#06B6D4', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: '#0891B2' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Show your hand to start collecting data...</p>
              {landmarks && (
                <p className="text-xs mt-2 text-cyan-400">
                  Hand detected! Collecting stability data...
                  <br />
                  Wrist positions: {wristHistory.current.length}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Therapy Recommendations */}
      <div className="mt-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/20">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Therapy Insights:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {currentMetrics.currentStability >= 80 && (
            <div className="text-green-400">✓ Excellent hand control - continue current exercises</div>
          )}
          {currentMetrics.currentStability < 60 && (
            <div className="text-yellow-400">⚠ Practice stability exercises - hold gestures longer</div>
          )}
          {currentMetrics.maxRangeOfMotion < 0.2 && (
            <div className="text-orange-400">→ Increase range of motion with stretching</div>
          )}
          {healthData.length > 10 && (
            <div className="text-blue-400">📊 Good data collection - {healthData.length} samples recorded</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RehabDashboard