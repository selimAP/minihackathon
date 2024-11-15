# WeatherGotchi

## Project Overview

**WeatherGotchi** 
is a Tamagotchi-like weather assistant tool that displays current weather conditions based on the user's location. Developed 
during the [miniHackathon (by Kevin Chromik)](https://minihackathon.de/discord/), this project was completed in approximately 13 hours. While I didn't manage to implement all planned 
features, such as associating different animals with weather conditions due to time constraints and the complexity of pixel design, the website already provides a user-friendly experience.

## Website
https://weathergotchi.fun/

## Code Overview

### Key Functions

1. **Geolocation:**
   - Utilizes geolocation API to retrieve the user's current location.

2. **Fetching Weather Data:**
   - `fetchWeatherByCoords`: This function retrieves weather data from the Open-Meteo API based on the fetched coordinates (latitude and longitude).

3. **Fetching City Name:**
   - `fetchCityName`: Determines the city name based on coordinates and updates the user interface accordingly.

4. **Updating Weather Data:**
   - `updateWeather`: Updates the user interface with current weather data, including temperature, pressure, humidity, wind speed, UV index, and formats sunrise and sunset times.

5. **Translating Weather Conditions:**
   - `translateWeatherCode`: Translates weather codes returned by the API into readable weather conditions.

## Challenges

- **Animal Association:** Planned to associate each weather type with a specific animal, but due to time constraints, this feature was not implemented.
- **Pressure and Altitude Display:** Issues with displaying air pressure and altitude correctly. This could be due to API limitations or data processing methods.

## Conclusion

WeatherGotchi is a creative approach to providing weather data in an engaging format. With further enhancements and additional features, it could become a useful tool for daily weather forecasts.
