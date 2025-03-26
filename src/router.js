"use strict";

function loadComponent(route, params) {
    const app = document.getElementById('app');
    if (app) {
        // Nettoyer le contenu précédent
        app.innerHTML = "";
        // Charger le composant en fonction de la route
        switch (route) {
            case "/":
                app.appendChild(document.createElement('home-page'));
                break;
            case "/lignes":
                const lignesPage = document.createElement('lignes-page');
                if (params) {
                    const facNbl = params.split('=')[1];
                    lignesPage.setAttribute('data-params', facNbl);
                }
                app.appendChild(lignesPage);
                break;
            default:
                app.appendChild(document.createElement('home-page'));
                break;
        }
    }
}

// Fonction pour gérer les routes avec hash
function router() {
    const hash = window.location.hash.slice(1);
    let pathNoParams = hash.split('?')[0];
    const params = hash.split('?')[1];
    if (pathNoParams === "")
        pathNoParams = "/"; // Rediriger vers la page d'accueil par défaut

    loadComponent(pathNoParams, params);
}
// Écouter les changements dans l'URL du hash
window.addEventListener("hashchange", router);
// Appeler la fonction router lors du chargement initial de la page
window.addEventListener("DOMContentLoaded", router);
