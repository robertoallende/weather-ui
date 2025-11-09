# Unit 2: Data

## Objective
Create API abstraction layer that normalizes weather data from the CGI endpoint, includes emoji mapping for weather conditions, and handles errors gracefully.

## Implementation
- Build weather service abstraction that calls localhost:8000/cgi-bin/weather.cgi
- Implement emoji mapping for all 20 weather conditions from API
- Create error handling for network failures, invalid responses, and timeouts
- Design normalized data structure for consistent UI consumption
- Add loading states and error state management

## AI Interactions
[To be documented during implementation]

## Files Modified
[To be documented during implementation]

## Status: Planned
Depends on Unit 1 completion. Ready to implement data abstraction layer with weather emoji mapping:
- sunny/clear → ☀️
- cloudy/overcast → ☁️  
- partly cloudy → ⛅
- rainy/drizzle → 🌧️/🌦️
- thunderstorm/stormy → ⛈️
- snowy/blizzard/hail/sleet → 🌨️/❄️
- foggy/mist → 🌫️
- windy → 💨
- hot/cold/humid/dry → 🌡️/🥶/💧/🏜️
