"use strict";
// Fonction pour mettre à jour le composant en fonction de la route
function loadComponent(route) {
    const app = document.getElementById('app');
    if (app) {
        // Nettoyer le contenu précédent
        app.innerHTML = "";
        // Charger le composant en fonction de la route
        switch (route) {
            case "/":
                app.appendChild(document.createElement('home-page'));
                break;
            default:
                app.appendChild(document.createElement('home-page'));
                break;
        }
    }
}
// Fonction pour gérer les routes avec hash
function router() {
    let hash = window.location.hash.slice(1);
    if (hash === "")
        hash = "/"; // Rediriger vers la page d'accueil par défaut
    loadComponent(hash);
}
// Écouter les changements dans l'URL du hash
window.addEventListener("hashchange", router);
// Appeler la fonction router lors du chargement initial de la page
window.addEventListener("DOMContentLoaded", router);
