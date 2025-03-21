import { CustomElement } from '../utils/componentFactory.js';

export default class InputDouble extends CustomElement {
    render() {
        // On récupère les attributs du composant
        const label = this.getAttribute('label') || '';
        const id = this.getAttribute('idname') || '';
        const input = this.getAttribute('input') || 'text';
        const input2 = this.getAttribute('input2') || 'text';
        const attr = JSON.parse(this.getAttribute('attr')) || '';
        const inputCss = this.getAttribute('inputCss') || '';
        const inputCss2 = this.getAttribute('inputCss2') || '';
        const css = this.getAttribute('css') || '';
        const value = this.getAttribute('value') || '';
        const value2 = this.getAttribute('value2') || '';

        // On crée le conteneur principal
        const container = document.createElement('div');
        container.className = `flex flex-col ${css}`;

        // On crée le label
        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', id);
        labelElement.textContent = label;
        labelElement.className = 'text-base font-medium';
        container.appendChild(labelElement);

        // On crée les inputs
        const doubleContainer = document.createElement('div');
        doubleContainer.className = 'flex';

        const inputElt = document.createElement('input');
        inputElt.className = `bg-white rounded-l border border-r-transparent h-9 px-2 ${inputCss}`;
        inputElt.id = `${id}1`;
        inputElt.type = input;
        inputElt.value = value;
        if (attr) {
            inputElt.setAttribute(attr['lib'], attr['value']);
        }
        doubleContainer.appendChild(inputElt);

        const inputElt2 = document.createElement('input');
        inputElt2.className = `bg-white rounded-r border h-9 px-2 ${inputCss2}`;
        inputElt2.id = `${id}2`;
        inputElt2.type = input2;
        inputElt2.value = value2;
        //inputElt2.readOnly = true;
        doubleContainer.appendChild(inputElt2);

        container.appendChild(doubleContainer);

        // On vide le contenu actuel et on ajoute le nouveau contenu
        this.innerHTML = '';
        this.appendChild(container);
    }
}

customElements.define('sg-input-double', InputDouble);
