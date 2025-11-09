import { useWeather } from '../hooks/useWeather';

export default function WeatherDisplay() {
  const { data, loading, hasError, error } = useWeather('Wellington, New Zealand', true);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-lg text-gray-700">Wellington, New Zealand</div>
          <div className="loading loading-spinner loading-lg text-gray-400"></div>
          <div className="text-xl text-gray-700">Loading weather...</div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-lg text-gray-700">Wellington, New Zealand</div>
          <div className="text-[5.625rem] leading-none">❓</div>
          <div className="alert alert-error">
            <div className="text-left">
              <div className="font-bold">{error.type.toUpperCase()}</div>
              <div className="text-sm">{error.message}</div>
              {error.userAction && (
                <div className="text-xs mt-1 opacity-75">💡 {error.userAction}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-lg text-gray-700">Wellington, New Zealand</div>
          <div className="text-[5.625rem] leading-none">❓</div>
          <div className="text-xl text-gray-700">No weather data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center font-sans overflow-hidden">
      <div className="text-center">
        {/* Location */}
        <div className="text-xl text-gray-800 font-normal mb-6 block">
          {data.location}
        </div>
        
        {/* Weather Icon with extra spacing */}
        <div className="text-[5.625rem] py-7 block">
          {data.emoji}
        </div>
        
        {/* Temperature */}
        <div className="text-[4.21875rem] font-bold text-gray-900 mb-6 block">
          {data.temperature}° C
        </div>
        
        {/* Condition */}
        <div className="text-3xl text-gray-800 font-normal block capitalize">
          {data.condition}
        </div>
      </div>
    </div>
  );
}
