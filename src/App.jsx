import { useWeather } from './hooks/useWeather'

function App() {
  const { data, loading, hasError, error, refetch, status } = useWeather('Wellington, New Zealand', false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Weather UI</h1>
        
        <div className="alert alert-info mb-4">
          <span>🧪 Testing Enhanced Error Handling (Subunit 2.4)</span>
        </div>

        <div className="mb-4 space-y-2">
          <div className="text-sm text-gray-600">Status: {status}</div>
          <button 
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
            onClick={() => refetch()}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Fetch Weather'}
          </button>
        </div>

        {hasError && (
          <div className="alert alert-error mb-4">
            <div className="text-left">
              <div className="font-bold">❌ {error.type.toUpperCase()}</div>
              <div className="text-sm">{error.message}</div>
              {error.userAction && (
                <div className="text-xs mt-1 opacity-75">💡 {error.userAction}</div>
              )}
            </div>
          </div>
        )}

        {data && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold mb-4">Weather Data (via useWeather hook):</h3>
              <div className="text-center space-y-2">
                <div className="text-6xl">{data.emoji}</div>
                <div className="text-2xl font-bold">{data.temperature}°C</div>
                <div className="text-lg">{data.condition}</div>
                <div className="text-sm text-gray-600">{data.location}</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2">Hook State:</h4>
              <pre className="text-left text-xs overflow-auto">
                {JSON.stringify({ 
                  status, 
                  loading, 
                  hasError, 
                  data,
                  error 
                }, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
