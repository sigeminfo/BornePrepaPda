import '../components/Btn.js';
import '../components/Input.js';

import { Global } from '../models/globalModel.js';

export class LoginPage extends HTMLElement {
    constructor() {
        super();
        this.globalModel = new Global();
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const loginButton = this.querySelector('#login');
        if (loginButton) {
            loginButton.addEventListener('click', () => this.login());
        }
    }

    async login() {
        try {
            const id = this.querySelector('#id').value;
            const mdp = this.querySelector('#mdp').value;
            let connexion = await this.globalModel.connexion(id, mdp);

            if (connexion == 'true') {
                console.log('Connexion réussie');
                sessionStorage.setItem('isLogged', 'true');
                //window.location.hash = '/prepa';
                setTimeout(() => {
                    console.log(window.location);
                    window.location.hash = '/prepa';
                    console.log('Redirecting to /prepa');
                }, 100);
            }
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            alert('Erreur de connexion au serveur');
        }
        
    }

    render() {
        this.innerHTML = `
            <main class='bg-white h-screen flex justify-center items-center'>
                <div class='flex flex-col gap-6 w-1/3 justify-center'>
                    <sg-input idname='id' label='Identifiant' input='text' inputCss='grow h-12'></sg-input>
                    <sg-input idname='mdp' label='Mot de passe' input='password' inputCss='grow h-12'></sg-input>
                    <sg-btn idname='login' label='Connexion' class='w-full' css='w-full text-white bg-dblueBase rounded h-12'>Se connecter</sg-btn>
                </div>
            </main>
        `;
    }
}
customElements.define('login-page', LoginPage);