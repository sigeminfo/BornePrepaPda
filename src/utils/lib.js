export function modalConfirm(resp) {
    let modalAlert = document.getElementById('modalAlert');
    let modalAlertContent = document.getElementById('modalAlertContent');

    let html = `<img class='w-16 h-16 mb-6' src='../../public/img/icons/validate.svg'>`;

    const showModalAndRedirect = (msg, fonction, delay) => {
        modalAlert.classList.remove('hidden');
        modalAlert.classList.add('flex');
        modalAlertContent.innerHTML = html + msg;
        setTimeout(() => {
            if (fonction) {
                setTimeout(() => {
                    if (fonction == 'addCuve') {
                        this.getStock();
                        let cuve = document.getElementById('selectCuveRemp').value;
                        this.getStockCuve(cuve);
                    } else if (fonction == 'finCuves') {
                        
                    }
                }, 300);
            }
        }, delay);
    };

    switch(resp.fonction) {
        case 'addCuve':
            showModalAndRedirect(resp.msg, 'addCuve', 2000);
            break;

        case 'finCuves':
            showModalAndRedirect(resp.msg, 'finCuves', 2000);
            break;
    }
}


export function setEventClickAddCuve() {
    const container = document.querySelector('#stockTheorique');
    console.log(container);
    container.addEventListener('click', (event) => {
        // Vérifier si l'élément cliqué ou un de ses parents a la classe 'addCuve'
        const button = event.target.closest('.addCuve');
        if (!button) return; // Si ce n'est pas un bouton addCuve, on sort

        // Récupérer le tr parent
        const tr = button.closest('tr');
        if (!tr) return;

        // Retirer la classe de tous les autres tr
        container.querySelectorAll('tr').forEach(row => {
            row.classList.remove('!bg-lblueBase');
        });

        // Récupérer les données
        const lfl = tr.dataset.id;
        const code = tr.querySelector('.code').innerHTML;
        const article = tr.querySelector('.article').innerHTML;
        const lot = tr.querySelector('.lot').innerHTML;
        const poin = tr.querySelector('.poin').innerHTML;

        // Ajouter la classe au tr sélectionné
        tr.classList.add('!bg-lblueBase');
        
        // Appeler la fonction de traitement
        this.activateAddCuve(lot, code, article, poin, lfl);
    });
}

export function setEventClickCancelCuve() {
    const container = document.querySelector('#stockCuve'); // Ajustez le sélecteur selon votre conteneur
    
    container.addEventListener('click', (event) => {
        const button = event.target.closest('.cancelUpdate');
        if (!button) return;

        const tr = button.closest('tr');
        if (!tr) return;

        const lfl = tr.dataset.id;
        const lot = tr.querySelector('.lot').innerHTML;
        const poin = tr.querySelector('.poin').innerHTML;
        const art = tr.querySelector('.art').innerHTML;

        const cuve = document.querySelector('.cuve.selected');
        const idCuve = cuve?.id.split('-')[1];

        let probs = [];
        if (!lfl) { probs.push('Lfl'); }
        if (!lot) { probs.push('Lot'); }
        if (!poin) { probs.push('Poids Net'); }
        if (!idCuve) { probs.push('id Cuve'); }
        
        if (probs.length > 0) {
            $.alert({
                title: 'Erreur',
                content: 'Il y a un problème avec les données suivantes renseignées dans votre lot : ' + probs.join(', '),
            });
            return;
        }

        $.confirm({
            title: 'Confirmation',
            useBootstrap: false,
            boxWidth: '40%',
            content: `Voulez-vous annuler la mise en cuve de ${art} ?`,
            buttons: {
                Retirer: {
                    btnClass: 'bg-dblueBase text-white',
                    action: () => {
                        this.cancelUpdate(lot, lfl, poin, idCuve);
                    }
                },
                Annuler: {}
            }
        });
    });
}

export function verifPoids() {
    const inputsPoids = document.getElementsByClassName('poidsRemp');
    const poidsMax = parseFloat(document.getElementById('poidsRemp').getAttribute('max'));

    const poidsSaisiTotal = Array
        .from(inputsPoids)
        .reduce((total, elt) => total + (parseFloat(elt.value) || 0), 0);

    if (poidsSaisiTotal > poidsMax) {
        $.alert({
            title: 'Attention !',
            content: 'Poids max saisissable : ' + poidsMax,
            useBootstrap: false,
            boxWidth: '25%'
        });
        return false;
    } else {
        return true;
    }
}

export function handlePoidsDechetChange(event) {
    const poidsSaisi = event.target.closest('.infoCuve').querySelector('.poidsRemp').value;
    const isPercentageInput = event.target.classList.contains('poidsDechetsRemp2');
    const container = event.target.closest('.relative');
    
    if (isPercentageInput) {
        // Calculate weight from percentage
        const pourcentage = parseFloat(event.target.value) || 0;
        const poids = (parseFloat(poidsSaisi) * pourcentage) / 100;
        const poidsInput = container.querySelector('.poidsDechetsRemp1');
        poidsInput.value = poids.toFixed(2);
    } else {
        // Calculate percentage from weight
        const valeurDechet = parseFloat(event.target.value) || 0;
        const pourcentage = (valeurDechet / parseFloat(poidsSaisi)) * 100;
        const pourcentageInput = container.querySelector('.poidsDechetsRemp2');
        pourcentageInput.value = pourcentage.toFixed(2);
    }
}

export function plusCuve(cuves) {
    let options = [];
    cuves.forEach(cuve => {
        options.push({ lib: cuve.cuve_lib, value: cuve.cuve_cod });
    });
    options.push({ lib: 'Palox', value: 'palox' });

    let lot = document.getElementById('lotRemp').value;
    let art1 = document.getElementById('inputArticleRemp1').value;
    let art2 = document.getElementById('inputArticleRemp2').value;

    let infoCuve = document.getElementById('divInfoCuve');
    
    // Add event delegation to the container
    if (!infoCuve.hasAttribute('data-events-attached')) {
        infoCuve.addEventListener('click', (event) => {
            // Handle btnRemp clicks
            const btnRemp = event.target.closest('.btnRemp');
            if (btnRemp) {
                const homePage = document.querySelector('home-page');
                if (homePage && typeof homePage.handleBtnRempClick === 'function') {
                    homePage.handleBtnRempClick(event);
                }
            }

            // Handle supprPlusCuve clicks
            const supprBtn = event.target.closest('.supprPlusCuve');
            if (supprBtn) {
                supprPlusCuve(supprBtn);
            }
        });

        infoCuve.addEventListener('input', (event) => {
            // Handle poids dechets calculations
            const isDechetInput = event.target.classList.contains('poidsDechetsRemp1') || 
                                event.target.classList.contains('poidsDechetsRemp2');
            if (isDechetInput) {
                handlePoidsDechetChange(event);
            }
        });

        // Mark the container as having events attached
        infoCuve.setAttribute('data-events-attached', 'true');
    }

    // Create and append new element without individual event listeners
    let html = `<div class='infoCuve flex gap-3 mt-3'>
                    <div class='supprPlusCuve mr-3 w-9 h-9 border-2 text-orangeBase border-orangeBase rounded-full flex items-center justify-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus"><path d="M5 12h14"/></svg>
                    </div>
                    <sg-select selectCss='w-40 selectCuveRemp' options='${JSON.stringify(options)}'></sg-select>
                    <sg-input input='text' inputCss='w-20 lotRemp disabled' value='${lot}'></sg-input>
                    <sg-input-double input='text' input2='text' value='${art1}' value2='${art2}' inputCss='w-24 disabled inputArticleRemp1' inputCss2='w-96 disabled inputArticleRemp2'></sg-input-double>
                    <sg-select selectCss='w-40 selectCalRemp'></sg-select>
                    <sg-input input='number' inputCss='w-32 poidsRemp'></sg-input>
                    <div class='relative'>
                        <sg-input-double input='number' input2='number' inputCss='w-24 poidsDechetsRemp1' inputCss2='w-20 poidsDechetsRemp2'></sg-input-double>
                        <span class='absolute right-2 bottom-1.5'>%</span>
                    </div>
                </div>
                <div class='flex items-end'>
                    <sg-btn css='bg-lblueBase text-white h-9 rounded w-24 btnRemp'>Valider</sg-btn>
                </div>`;
    
    let infoCuvDiv = document.createElement('div');
    infoCuvDiv.className = 'flex justify-between';
    infoCuvDiv.innerHTML = html;

    infoCuve.appendChild(infoCuvDiv);
}

export function supprPlusCuve(el) {
    let parent = el.parentElement.parentElement;
    if (parent) parent.remove();
}

window.supprPlusCuve = supprPlusCuve;

