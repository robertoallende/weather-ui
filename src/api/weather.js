const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_TIMEOUT = 5000; // 5 seconds

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
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const xmlText = await response.text();
    const parsedData = parseWeatherXML(xmlText);
    
    return {
      success: true,
      data: parsedData
    };

  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: {
          type: 'timeout',
          message: 'Request timed out after 5 seconds'
        }
      };
    }

    if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
      console.error('Network error details:', error);
      return {
        success: false,
        error: {
          type: 'network',
          message: `Unable to connect to weather service: ${error.message}`
        }
      };
    }

    if (error.message.includes('not found')) {
      return {
        success: false,
        error: {
          type: 'not_found',
          message: error.message
        }
      };
    }

    return {
      success: false,
      error: {
        type: 'parse_error',
        message: 'Failed to parse weather data'
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
