import { motion } from 'framer-motion'

export default function DemoPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <h1 className="text-4xl font-bold text-electric text-glow mb-4">MediaPipe Demo</h1>
      <p className="text-gray-400 mb-8">Hand tracking functionality demo</p>
      
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-electric mb-4">Camera Feed</h3>
        <div className="bg-black h-64 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">Camera feed will appear here</p>
        </div>
      </div>
      
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-electric mb-4">Hand Detection Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Hands Detected:</p>
            <p className="text-2xl font-bold text-electric">0</p>
          </div>
          <div>
            <p className="text-gray-400">Status:</p>
            <p className="text-green-400">Ready</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}