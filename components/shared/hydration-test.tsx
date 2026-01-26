'use client'

import { useEffect, useState } from 'react'

export function HydrationTest() {
  const [mounted, setMounted] = useState(false)
  const [timestamp, setTimestamp] = useState<string>('')

  useEffect(() => {
    setMounted(true)
    setTimestamp(new Date().toISOString())
  }, [])

  if (!mounted) {
    return (
      <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
        <p className="text-yellow-400">⏳ Component mounting...</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
      <p className="text-green-400">✅ Hydration successful!</p>
      <p className="text-sm text-gray-400 mt-1">Mounted at: {timestamp}</p>
    </div>
  )
}