export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white mb-4">Settings</h1>
      <p className="text-gray-400">Configure your Silent-Connect experience</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Camera Settings</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Camera Quality</span>
              <select className="bg-slate-700 text-white px-3 py-1 rounded">
                <option>HD (720p)</option>
                <option>Full HD (1080p)</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Frame Rate</span>
              <select className="bg-slate-700 text-white px-3 py-1 rounded">
                <option>30 FPS</option>
                <option>60 FPS</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Appearance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Theme</span>
              <select className="bg-slate-700 text-white px-3 py-1 rounded">
                <option>Dark (Cyber)</option>
                <option>Light</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Animations</span>
              <button className="bg-blue-600 text-white px-3 py-1 rounded">
                Enabled
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}