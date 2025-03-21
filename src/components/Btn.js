import { CustomElement } from '../utils/componentFactory.js';
export default class Btn extends CustomElement {
    render() {
        // On récupère les attributs du composant
        const id = this.getAttribute('idname') || '';
        const css = this.getAttribute('css') || '';
        const texte = this.innerHTML;
        const onclick = this.getAttribute('onclick') || '';
        // On crée le bouton
        const bouton = document.createElement('button');
        // On ajoute les attributs
        bouton.id = id;
        bouton.className = css;
        bouton.innerHTML = texte;

        if (onclick) {
            bouton.addEventListener('click', (event) => {
                eval(onclick);
            });
        }

        this.innerHTML = '';
        this.appendChild(bouton);
    }
}
customElements.define('sg-btn', Btn);