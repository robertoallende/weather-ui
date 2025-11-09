const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_TIMEOUT = 5000; // 5 seconds

// Weather condition to emoji mapping
const WEATHER_EMOJIS = {
  'sunny': '☀️',
  'clear': '☀️',
  'cloudy': '☁️',
  'partly cloudy': '⛅',
  'overcast': '☁️',
  'rainy': '🌧️',
  'drizzle': '🌦️',
  'thunderstorm': '⛈️',
  'stormy': '⛈️',
  'snowy': '🌨️',
  'blizzard': '❄️',
  'hail': '🌨️',
  'sleet': '🌨️',
  'foggy': '🌫️',
  'mist': '🌫️',
  'windy': '💨',
  'hot': '🌡️',
  'cold': '🥶',
  'humid': '💧',
  'dry': '🏜️'
};

/**
 * Normalizes raw weather data into consistent format
 * @param {Object} rawData - Raw API response data
 * @returns {Object} Normalized weather data with emoji
 */
function normalizeWeatherData(rawData) {
  // Validate input data
  if (!rawData || typeof rawData !== 'object') {
    throw new Error('Invalid weather data received');
  }

  // Handle temperature edge cases
  let temperature = 0;
  if (rawData.temperature) {
    const tempValue = parseFloat(rawData.temperature);
    if (isNaN(tempValue)) {
      console.warn('Invalid temperature value:', rawData.temperature);
      temperature = 0;
    } else {
      temperature = Math.round(tempValue);
    }
  }

  // Handle condition mapping with fallbacks
  const condition = rawData.description?.toLowerCase()?.trim() || 'unknown';
  let emoji = WEATHER_EMOJIS[condition];
  
  // Try partial matching for compound conditions
  if (!emoji) {
    for (const [key, value] of Object.entries(WEATHER_EMOJIS)) {
      if (condition.includes(key)) {
        emoji = value;
        break;
      }
    }
  }
  
  // Final fallback
  if (!emoji) {
    emoji = '❓';
    console.warn('Unknown weather condition:', rawData.description);
  }

  // Validate and clean location
  let location = rawData.location?.trim() || 'Unknown Location';
  if (location.length > 50) {
    location = location.substring(0, 47) + '...';
  }

  // Validate and clean condition description
  let conditionDisplay = rawData.description?.trim() || 'Unknown';
  if (conditionDisplay.length > 30) {
    conditionDisplay = conditionDisplay.substring(0, 27) + '...';
  }

  return {
    location: location,
    temperature: temperature,
    condition: conditionDisplay,
    emoji: emoji,
    unit: rawData.unit?.trim() || 'Celsius'
  };
}

/**
 * Fetches weather data from the CGI endpoint
 * Uses Vite proxy in development (empty base URL) or direct URL in production
 * @param {string} city - City name to fetch weather for
 * @returns {Promise<Object>} Raw API response or error object
 */
export async function fetchWeatherData(city = 'Wellington, New Zealand') {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const url = `${API_BASE_URL}/cgi-bin/weather.cgi?city=${encodeURIComponent(city)}`;
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/xml, text/xml, */*'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`City "${city}" not found`);
      }
      if (response.status === 500) {
        throw new Error('Server error - weather service is unavailable');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const xmlText = await response.text();
    const rawData = parseWeatherXML(xmlText);
    const normalizedData = normalizeWeatherData(rawData);
    
    return {
      success: true,
      data: normalizedData
    };

  } catch (error) {
    clearTimeout(timeoutId);
    
    // Debug logging to identify error types
    console.log('Error caught:', {
      name: error.name,
      message: error.message,
      type: typeof error,
      constructor: error.constructor.name
    });
    
    // Timeout error
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: {
          type: 'timeout',
          message: 'Weather service is taking too long to respond. Please try again.',
          userAction: 'Try refreshing the page or check your internet connection.'
        }
      };
    }

    // Server errors (500, service unavailable)
    if (error.message.includes('Server error') || 
        error.message.includes('service is unavailable') ||
        error.message.includes('HTTP 500')) {
      return {
        success: false,
        error: {
          type: 'network',
          message: 'Weather service is currently unavailable.',
          userAction: 'The server may be down. Please try again later.'
        }
      };
    }

    // Network connectivity errors (broader detection)
    if (error.message.includes('fetch') || 
        error.message.includes('Failed to fetch') || 
        error.message.includes('NetworkError') ||
        error.message.includes('ERR_CONNECTION_REFUSED') ||
        error.message.includes('ECONNREFUSED') ||
        error.name === 'TypeError' ||
        !navigator.onLine) {
      console.error('Network error details:', error);
      return {
        success: false,
        error: {
          type: 'network',
          message: 'Unable to connect to the weather service.',
          userAction: 'Check your internet connection and try again.'
        }
      };
    }

    // City not found errors
    if (error.message.includes('not found') || error.message.includes('404')) {
      return {
        success: false,
        error: {
          type: 'not_found',
          message: error.message,
          userAction: 'Please check the city name and try again.'
        }
      };
    }

    // XML parsing errors
    if (error.message.includes('parse') || error.message.includes('XML') || error.message.includes('Invalid')) {
      return {
        success: false,
        error: {
          type: 'parse_error',
          message: 'Weather data format is invalid.',
          userAction: 'This appears to be a server issue. Please try again later.'
        }
      };
    }

    // Generic fallback error
    return {
      success: false,
      error: {
        type: 'unknown',
        message: 'An unexpected error occurred while fetching weather data.',
        userAction: 'Please try again. If the problem persists, contact support.'
      }
    };
  }
}

/**
 * Parses XML response from weather API
 * @param {string} xmlText - Raw XML response
 * @returns {Object} Parsed weather data
 */
function parseWeatherXML(xmlText) {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Invalid XML format');
    }

    const weather = xmlDoc.querySelector('weather');
    if (!weather) {
      throw new Error('Invalid weather data format');
    }

    return {
      location: weather.querySelector('location')?.textContent || '',
      temperature: weather.querySelector('temperature')?.textContent || '0',
      unit: weather.querySelector('unit')?.textContent || 'Celsius',
      description: weather.querySelector('description')?.textContent || 'unknown',
      code: weather.querySelector('code')?.textContent || '0'
    };

  } catch (error) {
    throw new Error('Failed to parse XML response');
  }
}
