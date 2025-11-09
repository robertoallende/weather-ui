import { useState } from 'react'
import { fetchWeatherData } from './api/weather'

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)

  const testAPI = async () => {
    setLoading(true)
    const result = await fetchWeatherData('Wellington, New Zealand')
    setWeatherData(result)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Weather UI</h1>
        
        <div className="alert alert-info mb-4">
          <span>🧪 Testing API Service (Subunit 2.1)</span>
        </div>

        <button 
          className={`btn btn-primary mb-4 ${loading ? 'loading' : ''}`}
          onClick={testAPI}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Test Weather API'}
        </button>

        {weatherData && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">API Response:</h3>
            <pre className="text-left text-sm overflow-auto">
              {JSON.stringify(weatherData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
