import { useState, useEffect, useCallback } from 'react';
import { fetchWeatherData } from '../api/weather';

/**
 * Custom hook for weather data management
 * @param {string} city - City to fetch weather for
 * @param {boolean} autoFetch - Whether to fetch data on mount
 * @returns {Object} Weather state and actions
 */
export function useWeather(city = 'Wellington, New Zealand', autoFetch = true) {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async (cityName = city) => {
    // Validate city name
    if (!cityName || typeof cityName !== 'string' || cityName.trim().length === 0) {
      setError({
        type: 'validation',
        message: 'City name is required.',
        userAction: 'Please provide a valid city name.'
      });
      setStatus('error');
      return;
    }

    setStatus('loading');
    setError(null);
    
    try {
      const result = await fetchWeatherData(cityName.trim());
      
      if (result.success) {
        setData(result.data);
        setStatus('success');
      } else {
        setError(result.error);
        setStatus('error');
        setData(null);
      }
    } catch (err) {
      console.error('Unexpected error in useWeather:', err);
      setError({
        type: 'unknown',
        message: 'An unexpected error occurred.',
        userAction: 'Please try again. If the problem persists, refresh the page.'
      });
      setStatus('error');
      setData(null);
    }
  }, [city]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchWeather();
    }
  }, [fetchWeather, autoFetch]);

  // Computed values for convenience
  const loading = status === 'loading';
  const success = status === 'success';
  const hasError = status === 'error';

  return {
    // Data
    data,
    error,
    
    // Status flags
    loading,
    success,
    hasError,
    status,
    
    // Actions
    refetch: fetchWeather,
    reset: () => {
      setStatus('idle');
      setData(null);
      setError(null);
    }
  };
}
