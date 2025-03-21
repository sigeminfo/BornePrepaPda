/* décommenter si besoin d'une authentification */
//import { AuthService } from "./authService.js";

export class ApiService {
    constructor() {
        // Initialisation de l'URL de l'API à partir des variables d'environnement
        this.apiUrl = import.meta.env.VITE_API_URL;
    }

    
    // Convertit un objet en paramètres d'URI
    objectToUriParams(obj) { 
        return Object.entries(obj)
            .map(([key, value]) => {
                if (value === null || value === undefined) {
                    return encodeURIComponent(key);
                }
                // Encode la clé et la valeur
                return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
            })
            // Joint les paires clé-valeur avec '&'
            .join('&');
    }

    // Méthode pour effectuer une requête GET
    async get(endpoint, data) {
        const token = '';   
        // Convertit les données en paramètres d'URI 
        const uriParams = this.objectToUriParams(data);
        /* décommenter si besoin d'une authentification */
        //const token = uriParams ? `&token=${AuthService.getToken()}` : `token=${AuthService.getToken()}`;
        // Effectue la requête fetch
        const response = await fetch(`${this.apiUrl}${endpoint}?${uriParams}${token}`);

        return response.json();
    }

    // Méthode pour effectuer une requête POST
    async post(endpoint, data) {
        const token = '';
        /* décommenter si besoin d'une authentification */
        //const token = `token=${AuthService.getToken()}`;
        const response = await fetch(`${this.apiUrl}${endpoint}?${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    // Méthode pour effectuer une requête PUT
    async put(endpoint, data) {
        const token = '';
        /* décommenter si besoin d'une authentification */
        //const token = `token=${AuthService.getToken()}`;
        const response = await fetch(`${this.apiUrl}${endpoint}?${token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }
}