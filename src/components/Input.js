import { CustomElement } from '../utils/componentFactory.js';

export default class Input extends CustomElement {
    render() {
        // On récupère les attributs du composant
        const label = this.getAttribute('label') || '';
        const id = this.getAttribute('idname') || '';
        const input = this.getAttribute('input') || 'text';
        const attr = JSON.parse(this.getAttribute('attr')) || '';
        const inputCss = this.getAttribute('inputCss') || '';
        const css = this.getAttribute('css') || '';
        const value = this.getAttribute('value') || '';
        const placeholder = this.getAttribute('placeholder') || '';
        const disabled = this.getAttribute('disabled') || '';

        // On crée le conteneur principal
        const container = document.createElement('div');
        container.className = `flex flex-col ${css}`;

        // On crée le label
        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', id);
        labelElement.textContent = label;
        labelElement.className = 'text-base font-medium';
        container.appendChild(labelElement);

        // On crée l'input principal
        const inputElt = document.createElement('input');
        inputElt.className = `bg-white rounded border h-9 px-2 ${inputCss}`;
        inputElt.id = id;
        inputElt.type = input;
        inputElt.placeholder = placeholder;
        if (disabled) {
            inputElt.disabled = 'disabled';
        }
        if (attr) {
            inputElt.setAttribute(attr['lib'], attr['value']);
        }
        inputElt.value = value;
        container.appendChild(inputElt);

        // On vide le contenu actuel et on ajoute le nouveau contenu
        this.innerHTML = '';
        this.appendChild(container);
    }
}

customElements.define('sg-input', Input);