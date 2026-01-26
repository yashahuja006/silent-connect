export default function SmartHomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white mb-4">Smart Home Control</h1>
      <p className="text-gray-400">Control your smart devices with hand gestures</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Living Room</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Lights</span>
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">ON</button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">TV</span>
              <button className="bg-red-600 text-white px-3 py-1 rounded text-sm">OFF</button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">AC</span>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">72°F</button>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Kitchen</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Lights</span>
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">ON</button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Coffee Maker</span>
              <button className="bg-red-600 text-white px-3 py-1 rounded text-sm">OFF</button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Dishwasher</span>
              <button className="bg-yellow-600 text-white px-3 py-1 rounded text-sm">RUNNING</button>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Bedroom</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Lights</span>
              <button className="bg-red-600 text-white px-3 py-1 rounded text-sm">OFF</button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Fan</span>
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">ON</button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Blinds</span>
              <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm">CLOSED</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Gesture Commands</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Light Controls</h4>
            <ul className="space-y-2 text-gray-300">
              <li>👆 Point up - Turn lights ON</li>
              <li>👇 Point down - Turn lights OFF</li>
              <li>✋ Open palm - Dim lights</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Device Controls</h4>
            <ul className="space-y-2 text-gray-300">
              <li>👍 Thumbs up - Turn device ON</li>
              <li>👎 Thumbs down - Turn device OFF</li>
              <li>✌️ Peace sign - Toggle mode</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}