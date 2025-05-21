import { Global } from '../models/globalModel.js';

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

export function lessDate() {
    const dateInput = document.getElementById('dateFiltre');
    if (dateInput && dateInput.value) {
        const currentDate = new Date(dateInput.value);
        currentDate.setDate(currentDate.getDate() - 1);
        dateInput.value = currentDate.toISOString().split('T')[0];
    }
}

export function moreDate() {
    const dateInput = document.getElementById('dateFiltre');
    if (dateInput && dateInput.value) {
        const currentDate = new Date(dateInput.value);
        currentDate.setDate(currentDate.getDate() + 1);
        dateInput.value = currentDate.toISOString().split('T')[0];
    }
}

export function impression(facNbl = 0, typeImp = "", nbEx = 1) {
    const globalModel = new Global();
    const imgUrl = import.meta.env.VITE_IMG_URL;

    return globalModel.impression(facNbl, typeImp, false, nbEx)
        .then(response => {
            console.log("Impression successful:", response);
            /*
            let printFrame = document.getElementById('impFrame');
            console.log(printFrame);
            printFrame.src = imgUrl + response.IOurl;
            printFrame.style.display = 'block';
            printFrame.contentWindow.focus();
            */
            return response;
        })
        .catch(error => {
            console.error("Error during impression:", error);
            throw error;
        });   
}

export function confirmImpressionBL(facNbl) { 
    $.confirm({
        title: 'Confirmation',
        content: `<p>Voulez-vous imprimer le BL ?</p>`,
        buttons: {
            confirm: {
                text: 'Oui',
                btnClass: 'btn-confirm',
                action: function () {
                    impression(facNbl, 'BL', total);
                }
            },
            cancel: {
                text: 'Non',
                btnClass: 'btn-cancel',
                action: function () {
                    console.log('Action cancelled');
                }
            }
        }
    });
}