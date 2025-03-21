export class CustomElement extends HTMLElement {
    constructor(observedAttributes = [], renderFunction) {
        super();
        // Fonction de rendu à utiliser pour afficher l'élément
        this.renderFunction = renderFunction;
        // Liste des attributs observés
        CustomElement.observedAttributesList = observedAttributes;
    }
    // Méthode appelée lorsque l'élément est ajouté au DOM
    connectedCallback() {
        this.render();
    }
    // Retourne la liste des attributs observés
    static get observedAttributes() {
        return this.observedAttributesList || [];
    }
    // Méthode appelée lorsque l'un des attributs observés change
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            // Rendre à nouveau l'élément si la valeur a changé
            this.render();
        }
    }
    render() {
        const renderFunction = this.renderFunction;
        // Appelle la fonction de rendu avec le contexte de l'élément
        renderFunction.call(this);
    }
}
// Initialisation de la liste des attributs observés
CustomElement.observedAttributesList = [];
