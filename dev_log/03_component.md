# Unit 3: Component

## Objective
Build the core weather display component that matches the design mockup exactly, integrating with the data abstraction layer to show weather information for Wellington, New Zealand.

## Implementation
- Create WeatherDisplay component in src/components/WeatherDisplay.jsx
- Match design mockup specifications:
  - Light gray background (bg-gray-100)
  - Full screen centered layout with generous vertical spacing
  - Clean sans-serif typography (Tailwind default font stack)
  - Location text: medium size, regular weight
  - Weather emoji: large display in center
  - Temperature: very large, bold (text-8xl or text-9xl)
  - Condition text: medium size, regular weight
  - Dark gray/black text color (text-gray-900)
- Integrate with useWeather hook from Unit 2 with auto-fetch enabled
- Add loading states using DaisyUI loading component
- Implement error display using DaisyUI alert components
- No auto-refresh - manual browser reload only

## AI Interactions
[To be documented during implementation]

## Files Modified
[To be documented during implementation]

## Status: Planned
Depends on Unit 2 completion. Component will display:
- Location: "Wellington, New Zealand" (from API response)
- Weather emoji from data service mapping (replacing gradient sun/cloud graphic)
- Temperature: Rounded to whole numbers with large bold display (e.g., "25°C")
- Condition: API description string (e.g., "Mostly Cloudy")
- Auto-fetch weather data on component mount
- Full screen centered layout matching design mockup exactly
