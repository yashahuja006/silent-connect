export default function GuidePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white mb-4">Sign Language Guide</h1>
      <p className="text-gray-400">Learn the meaning and execution of various hand gestures</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-white mb-2">Hello</h3>
          <p className="text-gray-400 mb-4">Open palm facing forward</p>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Easy</span>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-white mb-2">Thank You</h3>
          <p className="text-gray-400 mb-4">Flat hand touching chin, then moving forward</p>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Easy</span>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-white mb-2">Yes</h3>
          <p className="text-gray-400 mb-4">Closed fist nodding up and down</p>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Easy</span>
        </div>
      </div>
      
      <div className="bg-slate-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Learning Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Hand Position</h3>
            <p className="text-gray-400">Keep your hands clearly visible in front of the camera</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Practice</h3>
            <p className="text-gray-400">Regular practice improves both speed and accuracy</p>
          </div>
        </div>
      </div>
    </div>
  )
}