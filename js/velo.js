'use strict';

async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.data.stations;
    } catch (error) {
        console.error('Error fetching data:', error);
        return []; // Retourne un tableau vide en cas d'erreur
    }
}

async function getStationsInfo() {
    return fetchData('https://api.cyclocity.fr/contracts/nancy/gbfs/station_information.json');
}

async function getStationsStatus() {
    return fetchData('https://api.cyclocity.fr/contracts/nancy/gbfs/station_status.json');
}

async function createVeloMap(coordonneeClient) {
    const [stationsInfo, stationsStatus] = await Promise.all([getStationsInfo(), getStationsStatus()]);

    const map = L.map('map').setView(coordonneeClient, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const stations = stationsInfo.map(info => {
        const status = stationsStatus.find(status => status.station_id === info.station_id) || {};
        return {
            ...info,
            ...status
        };
    });

    stations.forEach(station => {
        const marker = L.marker([station.lat, station.lon]).addTo(map);
        const popupContent = `
            <b>${station.name}</b><br>
            ${station.address}<br>
            Vélos disponibles: ${station.num_bikes_available || 0}<br>
            Docks disponibles: ${station.num_docks_available || 0}
        `;
        marker.bindPopup(popupContent);
    });
}

export {
    createVeloMap
};