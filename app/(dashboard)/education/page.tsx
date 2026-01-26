export default function EducationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white mb-4">Education Center</h1>
      <p className="text-gray-400">Learn and master gesture recognition</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Basic Gestures</h3>
          <p className="text-gray-400 mb-4">Learn fundamental hand gestures</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Start Learning
          </button>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Practice Mode</h3>
          <p className="text-gray-400 mb-4">Practice with real-time feedback</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Start Practice
          </button>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Quiz Master</h3>
          <p className="text-gray-400 mb-4">Test your knowledge</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Take Quiz
          </button>
        </div>
      </div>
      
      <div className="bg-slate-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Learning Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">12</div>
            <div className="text-gray-400">Lessons Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">85%</div>
            <div className="text-gray-400">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">7</div>
            <div className="text-gray-400">Day Streak</div>
          </div>
        </div>
      </div>
    </div>
  )
}