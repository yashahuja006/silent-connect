import { motion } from 'framer-motion'

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <h1 className="text-4xl font-bold text-electric text-glow mb-4">Settings</h1>
      <p className="text-gray-400 mb-8">Configure your Silent-Connect experience</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-electric mb-4">Camera Settings</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Camera Quality</span>
              <select className="glass-button px-3 py-1">
                <option>HD (720p)</option>
                <option>Full HD (1080p)</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Frame Rate</span>
              <select className="glass-button px-3 py-1">
                <option>30 FPS</option>
                <option>60 FPS</option>
              </select>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-electric mb-4">Appearance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Theme</span>
              <select className="glass-button px-3 py-1">
                <option>Dark (Cyber)</option>
                <option>Light</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Animations</span>
              <button className="glass-button px-3 py-1 text-electric">
                Enabled
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}