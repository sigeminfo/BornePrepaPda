import { CustomElement } from '../utils/componentFactory.js';

// Fonction pour définir la recherche dynamique en fonction de l'élément
export function setDynamicSearch(input) {
    if (input.dataset.searchElement) {
        const dynamicSearch = document.querySelector(`#${input.dataset.searchElement}`);
        dynamicSearch.setAttribute('parentInputValue', input.value);
    }
}
// Fonction pour afficher la recherche dynamique
export function displayDynamicSearch(input) {
    if (input.dataset.searchElement) {
        const dynamicSearch = document.querySelector(`#${input.dataset.searchElement}`);
        dynamicSearch.setAttribute('display', "inline");
        //dynamicSearch.classList.add('inline');
    }
}
// Fonction pour masquer les éléments de recherche dynamique qui ne sont pas ciblés
export function hideDynamicSearch(target) {
    const dynamicSearch = [...document.querySelectorAll(`sg-dynamic-search`)];
    dynamicSearch.forEach((search) => {
        if (target != search && target.dataset.searchElement != search.id) {
            search.setAttribute('display', "none");
            //search.classList.add('hidden');
        }
    });
}

// Définition de la classe DynamicSearch qui hérite de CustomElement
export default class DynamicSearch extends CustomElement {
    // Déclaration des attributs observés par le composant
    static get observedAttributes() {
        return ['parentinputvalue', 'display', 'data'];
    }
    constructor() {
        super([], () => this.render());
        // Élément conteneur pour les résultats de recherche
        this.wrapper = null;
    }
    // Méthode appelée lorsque le composant est ajouté au DOM
    connectedCallback() {
        this.render();
    }
    // Méthode appelée lorsque l'un des attributs observés change
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "parentinputvalue" && this.wrapper && this.wrapper.children) {
            [...this.wrapper.children].forEach(child => {
                if (child.textContent.toLowerCase().includes(newValue.toLowerCase()) || child.dataset.id.toLowerCase().includes(newValue.toLowerCase())) {
                    child.style.display = 'flex';
                }
                else {
                    child.style.display = 'none';
                }
            });
        }
        else {
            this.render();
        }
    }
    // Méthode pour render le contenu du composant
    render() {
        // Récupération des attributs du composant
        const id = this.getAttribute('idname') || '';
        const css = this.getAttribute('css') || '';
        const double = this.getAttribute('double') || 0;
        const parentInputId = this.getAttribute('parentInputId') || '';
        const display = this.getAttribute('display') || 'none';

        // Création d'un élément div pour contenir les résultats de recherche
        const wrapper = document.createElement('div');
        wrapper.id = id;
        wrapper.className = `hidden absolute bg-white top-full left-0 w-full z-10 rounded max-h-96 overflow-y-auto shadow-md ${css}`;
        wrapper.style.display = display;

        // Récupération et traitement des données pour afficher les résultats
        const data = this.getAttribute('data') ? JSON.parse(this.getAttribute('data')) : []; // Ajout de la récupération des données
        data.forEach((line) => {
            if (line.id && line.name) {
                const div = document.createElement('div');
                div.className = 'flex py-2 px-4 border border-inherit hover:bg-lblueLightHover';
                if (double == 1) {
                    const pCode = document.createElement('p');
                    const pLib = document.createElement('p');
                    pCode.className = 'w-24';
                    pCode.textContent = line.id;
                    pLib.textContent = line.name;
                    div.appendChild(pCode);
                    div.appendChild(pLib);
                } else {
                    div.textContent = line.name;
                }
                div.dataset.id = line.id;
                wrapper.appendChild(div);
            }
        });

        // Gestionnaire d'événements pour la sélection d'un résultat
        wrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            if (parentInputId) {
                const parentInput = document.getElementById(parentInputId);
                //parentInput.value = e.target.dataset.id;
                if (double == 1) {
                    parentInput.value = e.target.parentElement.children[0].textContent;
                    parentInput.parentElement.children[1].value = e.target.parentElement.children[1].textContent;
                } else {
                    parentInput.value = e.target.textContent;
                }
                
                parentInput.dispatchEvent(new Event('change', { bubbles: true }));
                wrapper.style.display = 'none';
            }
        });
        this.wrapper = wrapper;

        // Nettoyage et ajout du wrapper au DOM
        this.innerHTML = '';
        this.appendChild(wrapper);
    }
}
// Définition du custom element 'sg-dynamic-search'
customElements.define('sg-dynamic-search', DynamicSearch);
