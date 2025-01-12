'use strict';

async function fetchJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return null; // Retourne null en cas d'erreur
    }
}

async function getAirQuality(ville) {
    const url = `https://services3.arcgis.com/Is0UwT37raQYl9Jj/arcgis/rest/services/ind_grandest/FeatureServer/0/query?where=lib_zone='${ville}'&f=pjson`;

    const data = await fetchJson(url);
    if (!data || !data.features) {
        return null; // Retourne null si aucune donnée n'est trouvée
    }

    const today = new Date().toISOString().split('T')[0];
    const latestFeature = data.features.find(feature => {
        const timestamp = feature.attributes.date_ech / 1000;
        const featureDate = new Date(timestamp * 1000).toISOString().split('T')[0];
        return feature.attributes.lib_zone === ville && featureDate === today;
    });

    return latestFeature ? latestFeature.attributes : null;
}

async function addAirQuality(ville) {
    const airQuality = await getAirQuality(ville);
    const airQualityEl = document.getElementById('floating-air-quality');

    if (airQuality) {
        airQualityEl.innerHTML = "Qualité de l'air: " + airQuality.lib_qual;
        airQualityEl.style.backgroundColor = airQuality.coul_qual;
    } else {
        airQualityEl.innerHTML = "Données de qualité de l'air non disponibles.";
        airQualityEl.style.backgroundColor = ''; // Réinitialiser le style si aucune donnée n'est disponible
    }
}

export {
    addAirQuality
};