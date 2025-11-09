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
          <span>🧪 Testing Data Normalization (Subunit 2.2)</span>
        </div>

        <button 
          className={`btn btn-primary mb-4 ${loading ? 'loading' : ''}`}
          onClick={testAPI}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Test Weather API'}
        </button>

        {weatherData && (
          <div className="space-y-4">
            {weatherData.success && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold mb-4">Normalized Weather Data:</h3>
                <div className="text-center space-y-2">
                  <div className="text-6xl">{weatherData.data.emoji}</div>
                  <div className="text-2xl font-bold">{weatherData.data.temperature}°C</div>
                  <div className="text-lg">{weatherData.data.condition}</div>
                  <div className="text-sm text-gray-600">{weatherData.data.location}</div>
                </div>
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2">Raw API Response:</h4>
              <pre className="text-left text-xs overflow-auto">
                {JSON.stringify(weatherData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
