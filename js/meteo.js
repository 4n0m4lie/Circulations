'use strict';

async function fetchWeatherData(ipInfo) {
    const url = `https://www.infoclimat.fr/public-api/gfs/json?_ll=${ipInfo.latitude},${ipInfo.longitude}&_auth=ARsDFFIsBCZRfFtsD3lSe1Q8ADUPeVRzBHgFZgtuAH1UMQNgUTNcPlU5VClSfVZkUn8AYVxmVW0Eb1I2WylSLgFgA25SNwRuUT1bPw83UnlUeAB9DzFUcwR4BWMLYwBhVCkDb1EzXCBVOFQoUmNWZlJnAH9cfFVsBGRSPVs1UjEBZwNkUjIEYVE6WyYPIFJjVGUAZg9mVD4EbwVhCzMAMFQzA2JRMlw5VThUKFJiVmtSZQBpXGtVbwRlUjVbKVIuARsDFFIsBCZRfFtsD3lSe1QyAD4PZA%3D%3D&_c=19f3aa7d766b6ba91191c8be71dd1ab2`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des données météo:', error);
        return null; // Retourne null en cas d'erreur
    }
}

function getWeatherHTML(data, time) {
    const temperature = Math.round(data['temperature']['2m'] - 273.15);
    const windSpeed = data['vent_moyen']['10m'];

    let cielClass = 'fa-sun';
    let weatherDescription = 'Ensoleillé';

    if (data['risque_neige'] > 0) {
        cielClass = 'fa-snowflake';
        weatherDescription = 'risque de neige';
    } else if (data['pluie'] > 0) {
        cielClass = 'fa-cloud-showers-heavy';
        weatherDescription = `Pluie ${data['pluie']} mm`;
    } else if (data['nebulosite']['totale'] > 50) {
        cielClass = 'fa-cloud';
        weatherDescription = 'Nuageux';
    } else if (data['nebulosite']['totale'] > 20) {
        cielClass = 'fa-cloud-sun';
        weatherDescription = 'Peu nuageux';
    }

    return `
    <div class="meteo-item">
        <h2 class="hour">${time}</h2>
        <div class="meteo-content">
            <div class="temperature">
                <i class="fas fa-thermometer-empty"></i><p>${temperature}°C</p>
            </div>
            <div class="vent">
                <i class="fas fa-wind"></i><p>${windSpeed} km/h</p>
            </div>
            <div class="ciel">
                <i class="fas ${cielClass}"></i><p>${weatherDescription}</p>
            </div>
        </div>
    </div>
    `;
}

async function addWeather(ipInfo) {
    const weatherData = await fetchWeatherData(ipInfo);

    if (!weatherData) {
        // Gérer le cas où les données météo ne sont pas disponibles
        document.getElementById('meteo-container').innerHTML = '<p>Erreur lors de la récupération des données météo.</p>';
        return;
    }

    const weatherEntries = Object.entries(weatherData);
    const selectedData = [weatherEntries[8], weatherEntries[10], weatherEntries[12], weatherEntries[14]];
    const timeOfDay = ['Matin', 'Midi', 'Soir', 'Nuit'];

    const weatherContainer = document.getElementById('meteo-container');
    weatherContainer.innerHTML = selectedData.map((entry, index) => getWeatherHTML(entry[1], timeOfDay[index])).join('');
}

export {
    addWeather
};
