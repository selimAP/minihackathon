document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://api.open-meteo.com/v1/forecast';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(apiUrl, latitude, longitude);
            fetchCityName(latitude, longitude);
        }, error => {
            alert('Standort konnte nicht abgerufen werden.');
        });
    } else {
        alert('Geolocation wird von diesem Browser nicht unterstützt.');
    }

    updateCurrentTime();
});

function fetchWeatherByCoords(apiUrl, latitude, longitude) {
    const params = {
        latitude: latitude,
        longitude: longitude,
        current_weather: true,
        timezone: 'auto',
        daily: 'uv_index_max,precipitation_sum,sunrise,sunset,temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,relative_humidity_2m_min'
    };

    const queryString = new URLSearchParams(params).toString();
    const requestUrl = `${apiUrl}?${queryString}`;

    fetch(requestUrl)
        .then(response => response.json())
        .then(data => updateWeather(data, latitude, longitude))
        .catch(error => console.error('Fehler beim Abrufen der Wetterdaten:', error));
}

function fetchCityName(latitude, longitude) {
    const geoApiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`;

    fetch(geoApiUrl)
        .then(response => response.json())
        .then(data => {
            const cityName = data.address.city || data.address.town || data.address.village || 'Unbekannt';
            const locationElement = document.querySelector('.main-content-main-top-location p');
            const tempElement = document.querySelector('.main-content-stats-temp p');
            
            if (locationElement) locationElement.textContent = cityName;
            if (tempElement) tempElement.textContent = cityName;
        })
        .catch(error => console.error('Fehler beim Abrufen des Standorts:', error));
}

function updateWeather(data, latitude, longitude) {
    const current = data.current_weather;

    if (current) {
        const tempElement = document.querySelector('.main-content-main-bottom-temp p');
        const statsTempElement = document.querySelector('.main-content-stats-temp h3');
        const pressureElement = document.querySelector('.main-content-stats-pressure h4');
        const coordinatesElement = document.querySelector('.main-content-stats-coordinates h4');
        const humidityElement = document.querySelector('.main-content-stats-humidity h4');
        const windElement = document.querySelector('.main-content-stats-wind h4');
        const uvElement = document.querySelector('.main-content-stats-uv h4');
        const conditionElement = document.querySelector('.main-content-stats-condition h4');

        if (tempElement) tempElement.textContent = `${current.temperature}°`;
        if (statsTempElement) statsTempElement.textContent = `${current.temperature}°`;

        const pressure = current.pressure_msl !== undefined ? current.pressure_msl : 'N/A';
        if (pressureElement) pressureElement.textContent = `${pressure}`;

        if (coordinatesElement) coordinatesElement.textContent = `Lat: ${latitude}, Lon: ${longitude}`;
        if (data.daily) {
            if (data.daily.temperature_2m_min) {
                document.querySelector('.main-content-main-bottom-lowest p').textContent = `L: ${data.daily.temperature_2m_min[0]}°`;
                document.querySelector('.main-content-stats-hl-flex h4:nth-child(1)').textContent = `L: ${data.daily.temperature_2m_min[0]}°`;
            }
            if (data.daily.temperature_2m_max) {
                document.querySelector('.main-content-main-bottom-highest p').textContent = `H: ${data.daily.temperature_2m_max[0]}°`;
                document.querySelector('.main-content-stats-hl-flex h4:nth-child(2)').textContent = `H: ${data.daily.temperature_2m_max[0]}°`;
            }
            if (humidityElement) humidityElement.textContent = `${data.daily.relative_humidity_2m_max[0]}%`;
            if (windElement) windElement.textContent = `${current.windspeed || 'N/A'}`;
            if (uvElement) uvElement.textContent = data.daily.uv_index_max[0];

            const sunrise = formatTime(data.daily.sunrise[0]);
            const sunset = formatTime(data.daily.sunset[0]);
            const sunriseElement = document.querySelector('.main-content-stats-sas h4 img[alt="sunrise"]').nextSibling;
            const sunsetElement = document.querySelector('.main-content-stats-sas h4 img[alt="sunset"]').nextSibling;

            if (sunriseElement) sunriseElement.textContent = sunrise;
            if (sunsetElement) sunsetElement.textContent = sunset;
        }

        if (conditionElement) {
            conditionElement.textContent = translateWeatherCode(current.weathercode);
        }
    }
}

function formatTime(isoTime) {
    if (!isoTime) return 'N/A';
    return new Date(isoTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function translateWeatherCode(code) {
    const weatherConditions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Light rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Light snowfall',
        73: 'Moderate snowfall',
        75: 'Heavy snowfall',
        80: 'Light rain showers',
        81: 'Moderate rain showers',
        95: 'Thunderstorm'
    };
    return weatherConditions[code] || 'Unknown';
}


function updateCurrentTime() {
    const update = () => {
        const now = new Date();
        const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const timeElement = document.querySelector('.main-content-main-top-time p');
        if (timeElement) timeElement.textContent = currentTime;
    };
    update();
    setInterval(update, 1000);
}

function showStats() {
    document.getElementById('main-content-stats-id').style.display = 'flex';
    document.getElementById('main-content-main-id').style.display = 'none';
    document.querySelector('.main-content-footer').style.display = 'none';
}

function showMain() {
    document.getElementById('main-content-main-id').style.display = 'flex';
    document.getElementById('main-content-stats-id').style.display = 'none';
    document.querySelector('.main-content-footer').style.display = 'none';
}

function showFooter() {
    document.getElementById('main-content-main-id').style.display = 'none';
    document.getElementById('main-content-stats-id').style.display = 'none';
    document.querySelector('.main-content-footer').style.display = 'flex';
}

function pp() {
    alert('Datenschutzbestimmungen:\n\nIhre Standortdaten werden nur verwendet, um genaue Wetterinformationen bereitzustellen. Wir speichern oder teilen Ihre Standortdaten nicht mit Dritten.');
}

function tos() {
    alert('Nutzungsbedingungen:\n\nDurch die Nutzung von WEATHERGOTCHI stimmen Sie zu, dass:\n- Ihre Standortdaten nur verwendet werden, um Wetterupdates abzurufen.\n- Keine persönlichen Daten gesammelt oder gespeichert werden.\n- Wir sind nicht haftbar für Ungenauigkeiten in den bereitgestellten Wetterdaten.');
}
