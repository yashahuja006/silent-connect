import { motion } from 'framer-motion'

export default function TranslatorPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <h1 className="text-4xl font-bold text-electric text-glow mb-4">Gesture Translator</h1>
      <p className="text-gray-400 mb-8">Real-time gesture recognition and translation</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-electric mb-4">Camera Feed</h3>
          <div className="bg-black h-64 rounded-lg flex items-center justify-center mb-4">
            <p className="text-gray-400">Camera feed will appear here</p>
          </div>
          <button className="glass-button px-4 py-2 text-white hover:text-electric transition-colors">
            Start Recognition
          </button>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-electric mb-4">Translation</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400">Detected Gesture:</p>
              <p className="text-2xl font-bold text-electric">Hello</p>
            </div>
            <div>
              <p className="text-gray-400">Translation:</p>
              <p className="text-lg text-white">Hello, how are you?</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}