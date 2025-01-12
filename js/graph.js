'use strict';

function createGraph(chartId, data, label) {
    const labels = data.map(item => item.label);
    const values = data.map(item => item.value);
    const ctx = document.getElementById(chartId);

    // Vérification si le contexte du canvas est disponible
    if (!ctx) {
        console.error(`Élément avec l'ID ${chartId} introuvable.`);
        return;
    }

    ctx.innerHTML = ''; // Réinitialise le contenu du canvas
    const myChart = ctx.getContext('2d');

    // Vérification pour voir si un graphique existe déjà et le détruire
    if (myChart.chart) {
        myChart.chart.destroy(); // Détruire le graphique existant pour éviter les doublons
    }

    // Création d'un nouveau graphique
    const chartConfig = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: values,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false // Ne pas remplir sous la courbe
            }]
        },
        options: {
            responsive: true, // Rendre le graphique responsive
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true // Commencer l'axe Y à zéro
                }
            }
        }
    };

    // Initialisation du graphique
    new Chart(myChart, chartConfig);
}

export {
    createGraph
};