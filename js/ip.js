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

async function getIpInfo() {
    const url = 'https://ipapi.co/json/';
    return await fetchJson(url);
}

async function getDepartmentFromCoordinates(latitude, longitude) {
    const url = `https://api-adresse.data.gouv.fr/reverse/?lon=${longitude}&lat=${latitude}`;
    const data = await fetchJson(url);

    if (data && data.features.length > 0) {
        return data.features[0].properties.context.split(', ')[0];
    }
    return null; // Retourne null si aucune donnée n'est trouvée
}

export {
    getIpInfo,
    getDepartmentFromCoordinates
}