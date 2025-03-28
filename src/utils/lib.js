export function getUrlParameter(paramName) {
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(hash.split('?')[1]);
    return searchParams.get(paramName);
}

// Permet de baisser le nombre de colis dans la modale pesée
export function lessColis() {
    const colisInput = document.getElementById('colis');
    const poidsNetInput = document.getElementById('poidsnet');

    if (colisInput && colisInput.value > 0) {
        // Get current values
        const currentColis = parseInt(colisInput.value);
        const currentPoidsNet = parseFloat(poidsNetInput.value) || 0;
        
        // Calculate weight per package (if more than one package)
        const weightPerPackage = currentColis > 1 ? currentPoidsNet / currentColis : currentPoidsNet;
        
        // Decrease package count
        colisInput.value = currentColis - 1;
        
        // Recalculate net weight based on new package count
        if (currentColis > 1) {
            poidsNetInput.value = (weightPerPackage * (currentColis - 1)).toFixed(2);
        }
    }
}