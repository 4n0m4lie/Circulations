'use strict';
import {getDepartmentFromCoordinates} from './ip.js';

async function fetchMaxevillePage(page = 1, pageSize = 50) {
    const url = 'https://tabular-api.data.gouv.fr/api/resources/2963ccb5-344d-4978-bdd3-08aaf9efe514/data/?page=' + page + '&page_size=' + pageSize;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.data
            .filter(item => item.MAXEVILLE !== null)
            .map(item => ({
                label: item.semaine,
                value: item.MAXEVILLE
            }));
    } catch (error) {
        return [];
    }
}

async function fetchAllMaxevilleData(){
    let page = 1;
    let data = [];
    // parcourir toutes les pages de données jusqu'à ce qu'une page vide soit retournée donc on a atteint la fin des données
    while (true) {
        let pageData = await fetchMaxevillePage(page);
        if (pageData.length === 0) {
            break;
        }
        data = data.concat(pageData);
        page++;
    }
    return data;
}

async function fetchSarsDataByDepartment(department, page = 1, pageSize = 50) {
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    const twoYearsAgoString = twoYearsAgo.toISOString().split('T')[0];
    const url = `https://tabular-api.data.gouv.fr/api/resources/5c4e1452-3850-4b59-b11c-3dd51d7fb8b5/data/?dep__exact=${department}&date__greater=${twoYearsAgoString}&page=${page}&page_size=${pageSize}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.data;
    } catch (error) {
        return [];
    }
}

async function fetchSarsDataByIp (ipInfo) {
    try {
        const department = await getDepartmentFromCoordinates(ipInfo.latitude, ipInfo.longitude);
        if (department) {
            let i = 1;
            let data = [];
            while (true) {
                let pageData = await fetchSarsDataByDepartment(department, i);
                if (!pageData || pageData.length === 0) {
                    break;
                }
                data = data.concat(pageData);
                i++;
            }
            return {
                department: department,
                data: data
            }
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    }
}

async function formatDataByHospitalization(data){
    const formattedData = data.map(item => ({
        label: item.date,
        value: item.hosp
    }));
    return formattedData;
}

async function formatDataByPositiveCases(data){
    const formattedData = data.map(item => ({
        label: item.date,
        value: item.pos
    }));
    return formattedData;
}


export {
    fetchAllMaxevilleData,
    fetchSarsDataByIp,
    formatDataByHospitalization,
    formatDataByPositiveCases
}