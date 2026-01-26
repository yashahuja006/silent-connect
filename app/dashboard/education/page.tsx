import { motion } from 'framer-motion'

export default function EducationPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <h1 className="text-4xl font-bold text-electric text-glow mb-4">Education Center</h1>
      <p className="text-gray-400 mb-8">Learn and master gesture recognition</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-electric mb-4">Basic Gestures</h3>
          <p className="text-gray-400 mb-4">Learn fundamental hand gestures</p>
          <button className="glass-button px-4 py-2 text-white hover:text-electric transition-colors">
            Start Learning
          </button>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-electric mb-4">Practice Mode</h3>
          <p className="text-gray-400 mb-4">Practice with real-time feedback</p>
          <button className="glass-button px-4 py-2 text-white hover:text-electric transition-colors">
            Start Practice
          </button>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-electric mb-4">Quiz Master</h3>
          <p className="text-gray-400 mb-4">Test your knowledge</p>
          <button className="glass-button px-4 py-2 text-white hover:text-electric transition-colors">
            Take Quiz
          </button>
        </div>
      </div>
      
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold text-electric mb-4">Learning Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-electric">12</div>
            <div className="text-gray-400">Lessons Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-electric">85%</div>
            <div className="text-gray-400">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-electric">7</div>
            <div className="text-gray-400">Day Streak</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}