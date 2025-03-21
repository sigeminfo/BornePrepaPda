import { CustomElement } from '../utils/componentFactory.js';

export default class Select extends CustomElement {
    static get observedAttributes() {
        return ['options'];
    }

    render() {
        // On récupère les attributs du composant
        const label = this.getAttribute('label') || '';
        const id = this.getAttribute('idname') || '';
        const attr = JSON.parse(this.getAttribute('attr')) || '';
        const selectCss = this.getAttribute('selectCss') || '';
        const css = this.getAttribute('css') || '';
        const options = JSON.parse(this.getAttribute('options')) || [];
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
        const select = document.createElement('select');
        select.className = `rounded border h-9 px-2 appearance-none bg-no-repeat bg-['url(/img/icons/select.svg)'] bg-[98%_center] bg-[25px_25px] ${selectCss}`;
        select.id = id;
        if (attr && attr.length > 0) {
            select.setAttribute(attr['lib'], attr['value']);
        }

        options.forEach(option => {
            const optionElt = document.createElement('option');
            optionElt.className = 'rounded';
            optionElt.value = option.value;
            optionElt.textContent = option.lib;
            select.appendChild(optionElt);
        });
        container.appendChild(select);

        // On vide le contenu actuel et on ajoute le nouveau contenu
        this.innerHTML = '';
        this.appendChild(container);
    }
}

customElements.define('sg-select', Select);