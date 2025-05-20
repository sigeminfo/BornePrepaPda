import '../components/TableClassic.js';
import '../components/Btn.js';
import '../components/Input.js';
import '../components/InputDouble.js';
import '../components/Select.js';
import { lessDate, moreDate, impression } from '../utils/lib.js';

import { Global } from '../models/globalModel.js';

export class HomePage extends HTMLElement {
    constructor() {
        super();
        this.globalModel = new Global();
        this.bindMethods();
        this.isEnteteVisible = false;
    }

    // Méthodes annexes des components et de lib.js
    bindMethods() {
        /*this.modalConfirm = modalConfirm.bind(this);
        this.setEventClickAddCuve = setEventClickAddCuve.bind(this);
        this.setEventClickCancelCuve = setEventClickCancelCuve.bind(this);
        this.setDynamicSearch = setDynamicSearch.bind(this);
        this.displayDynamicSearch = displayDynamicSearch.bind(this);
        this.hideDynamicSearch = hideDynamicSearch.bind(this);*/
    }

    connectedCallback() {
        this.render();
        this.initialize();
    }

    // Récupération des données principales et set up des événements
    initialize() {
        document.getElementById('dateFiltre').value = new Date().toISOString().split('T')[0];
        this.getFac();
        this.setupEventListeners();
    }

    // setup des événements
    setupEventListeners() {
        document.getElementById('toggleEntete').addEventListener('click', this.toggleEntete.bind(this));
        document.getElementById('btnFiltre').addEventListener('click', () => {
            this.toggleEntete();
            this.getFac();
        });

        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('modal').classList.add('hidden');
            document.getElementById('modalContent').innerHTML = '';
        });

        document.getElementById('lessDateBtn').addEventListener('click', lessDate);
        document.getElementById('moreDateBtn').addEventListener('click', moreDate);
        document.getElementById('stateFiltre').addEventListener('change', (event) => {
            this.toggleEntete();
            this.filterTableByState(event);
        });
        window.addEventListener("click", (e) => {
            if (e.target != document.getElementById("impFrame")) {
                let printFrame = document.getElementById("impFrame");
                printFrame.style.display = "none";
                printFrame.src = "";
            }
        });
    }

    filterTableByState(event) {
        const selectedValue = event.target.value;
        const tableRows = document.querySelectorAll('#tableCmd tbody tr');
        
        tableRows.forEach(row => {
            if (selectedValue === 'all') {
                row.style.display = '';
            } else if (selectedValue === 'inprogress') {
                row.style.display = row.classList.contains('cmdInProgress') ? '' : 'none';
            } else if (selectedValue === 'completed') {
                row.style.display = row.classList.contains('cmdCompleted') ? '' : 'none';
            } else if (selectedValue === 'none') {
                row.style.display = row.classList.contains('cmdNone') ? '' : 'none';
            }
        });
    }

    toggleEntete() {
        const entete = document.getElementById('entete');
        const toggleBtn = document.getElementById('toggleEntete');
        const chevron = toggleBtn.querySelector('svg');
        
        this.isEnteteVisible = !this.isEnteteVisible;
        
        if (this.isEnteteVisible) {
            entete.style.transform = 'translateY(0)';
            chevron.style.transform = 'rotate(0deg)';
        } else {
            entete.style.transform = 'translateY(-12.75rem)';
            chevron.style.transform = 'rotate(180deg)';
        }
    }

    handleTableClick(event) {
        // On vérifie d'abord si le click n'a pas été effectué sur le bouton d'impression
        const printButton = event.target.closest('.prepaImpBl');
        if (printButton) {
            event.preventDefault();
            event.stopPropagation();
            
            const row = printButton.closest('tr');
            if (row) {
                const facNbl = row.getAttribute('data-id');
                const palettes = row.getAttribute('data-palettes');
                if (facNbl) {
                    this.handleValidation(facNbl, JSON.parse(palettes)); // assignation nb palettes + impression
                    //impression(facNbl, 'BL');
                }
            }
            return;
        }
        
        const td = event.target.closest('td');
        if (!td) return;
        const tr = td.parentElement;
        //console.log(tr);
        if (!tr) return;

        const facNbl = tr.getAttribute('data-id');
        //console.log(facNbl);
        if (facNbl) {
            const client = tr.querySelector('.client').textContent;
            const date = document.getElementById('dateFiltre').value;
            sessionStorage.setItem('nbl', facNbl);
            sessionStorage.setItem('client', client);
            sessionStorage.setItem('date', date);
            window.location.hash = '/lignes?nbl=' + facNbl;
        }
    }

    handleValidation(facNbl, palettes) {         
        let htmlInput = "";

        palettes && palettes.forEach(pal => {
            console.log(pal);
            htmlInput += `<sg-input idname='numPal-${pal.Pal_Cod}' label='${pal.pal_lib}' attr='` + JSON.stringify({lib: "data-pal-cod", value:`${pal.Pal_Cod}`}) + `' input='number' inputCss='!h-14 rounded-md px-4 numPal' class='w-[45%]' value="${pal.palBl_nb}" step="0.01"></sg-input>`; 
        });
        
        const html = `<div class='flex flex-col gap-10'>
                        <div class='flex w-full items-end gap-6'>                    
                            ${htmlInput}
                            <sg-btn idname='validNumPal' css='bg-dblueBase text-white rounded-md w-full !h-14 text-xl font-semibold' class='w-[45%]'>Valider</sg-btn>
                        </div>                
                    </div>`;

        document.getElementById('modal').classList.remove('hidden');
        document.getElementById('modalContent').innerHTML = html;

        setTimeout(() => { 
            document.getElementById('validNumPal').addEventListener('click', () => {
                this.updateFac(facNbl);
            });
        }, 200);        
    }    


    updateFac(facNbl) {
        const numPals = [...document.getElementsByClassName('numPal')];
        const total = numPals.reduce((acc, cur) => acc + parseFloat(cur.value), 0);

        let jsonData = [];

        numPals.forEach(pal => {
            console.log(pal);
            jsonData.push({
                IOpalCod: pal.dataset.palCod,
                IOnumPal: pal.value,
                IOfacNbl: facNbl
            });
        });

        this.globalModel.updFacNumPal(jsonData) 
        .then(response => {
            console.log("Success :", response);
            document.getElementById('modal').classList.add('hidden');
            document.getElementById('modalContent').innerHTML = '';
            
            $.confirm({
                title: 'Confirmation',
                content: `<p>Voulez-vous imprimer ${total} étiquettes ?</p>`,
                buttons: {
                    confirm: {
                        text: 'Oui',
                        btnClass: 'btn-confirm',
                        action: function () {
                            impression(facNbl, 'etiquettes', total);

                            // a revoir mais marchait pas dans une fonction à part
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
                    },
                    cancel: {
                        text: 'Non',
                        btnClass: 'btn-cancel',
                        action: function () {
                            console.log('Action cancelled');

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
                    }
                }
            });
            
            
        })
        .catch(error => {
            console.error("Error updating line:", error);
        });
    }    


    async getFac() {
        try {
            const date = document.getElementById('dateFiltre').value;
            const cli = (document.getElementById('cliFiltre').value ? document.getElementById('cliFiltre').value : "");
            const art = (document.getElementById('artFiltre').value ? document.getElementById('artFiltre').value : "");
            const tou = (document.getElementById('touFiltre').value? document.getElementById('touFiltre').value : "");
            const com = (document.getElementById('comFiltre').value? document.getElementById('comFiltre').value : "");
            this.fac = await this.globalModel.getFac(date, cli, art, tou, com);
            //console.log(this.fac);
            this.querySelector('[idname="tableCmd"]').setAttribute('data', JSON.stringify(this.formatTable(this.fac)));
           
            document.getElementById('tableCmd').addEventListener('click', this.handleTableClick.bind(this));
        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
        }
    }
    
    formatTable() {
        let button = document.createElement('sg-btn');
        button.setAttribute('css', 'bg-dblueBase p-2 text-white rounded flex items-center prepaImpBl');
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-printer"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/></svg>';
        let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return {
            thead: [
                { lib: 'Date'},
                { lib: 'N°', css: 'text-right' },
                { lib: 'Client'},
                { lib: 'Commentaire' },
                { lib: 'Lignes', css: 'text-right'},
                { lib: 'Tournées' },
                { lib: 'Action' }
            ],
            tbody:
                this.fac && this.fac.map(val => {
                    //console.log(val);
                    let rowClass = '';
                    if (parseInt(val.nbCdePrep) === parseInt(val.nbLig)) {
                        rowClass = 'cmdCompleted';
                    } else if (parseInt(val.nbCdePrep) === 0) {
                        rowClass = 'cmdNone';
                    } else {
                        rowClass = 'cmdInProgress';
                    }

                    return {
                        id: val.fac_nbl,
                        attr: { "data-palettes": val.palettes && val.palettes.length ? JSON.stringify(val.palettes) : "" },
                        css: rowClass,
                        trData: [
                            { tdData: new Date(val.datebl).toLocaleDateString('fr-FR', options), css: 'date', type: '' },
                            { tdData: val.fac_nbl, css: 'commande text-right', type: '' },
                            { tdData: val.cli_nom, css: 'client', type: '' },
                            { tdData: val.fac_coin, css: 'commentaire' },
                            { tdData: val.nbCdePrep + ' / ' + val.nbLig, css: 'lignes text-right', type: '' },
                            { tdData: val.tou_nom, css: 'tournee', type: '' },
                            { tdData: button.outerHTML, css: '', type: 'button' }, 
                        ]
                    }
                })
        }
    }

    render() {
        this.innerHTML = `
            <main id='main' role='main' class='h-full flex flex-col relative'>
                <div id='entete' class='flex flex-col items-center w-full absolute top-0 left-0 right-0 z-10 -translate-y-[12.75rem]'>
                    <div class='bg-white shadow p-3 w-full flex flex-col gap-3'>
                        <div class='flex justify-between'>
                            <sg-input idname='cliFiltre' label='Client' placeholder='Nom du client' input='text' inputCss='grow' class='w-[45%]'></sg-input>
                            <sg-input idname='artFiltre' label='Article' placeholder='Libellé article' input='text' inputCss='grow' class='w-[45%]'></sg-input>
                        </div>
                        <div class='flex justify-between'>
                            <div class='flex justify-between gap-3 w-[45%]'>
                                <sg-input idname='dateFiltre' label='Date' input='date' inputCss='grow'></sg-input>
                                <div class='bg-dblueBase rounded text-white flex items-center'>
                                    <button class='w-12' id="lessDateBtn">-</button>
                                    <button class='w-12' id="moreDateBtn">+</button>
                                </div>
                            </div>
                            <sg-input idname='touFiltre' label='Tournée' input='text' inputCss='grow' class='w-[45%]'></sg-input>
                        </div>
                        <div class='flex justify-between'>
                            <sg-input idname='comFiltre' label='N° Commande' placeholder='N° Commande' input='text' inputCss='grow' class='w-[45%]'></sg-input>
                            <sg-select idname='stateFiltre' label='État commande' selectCss='grow' class='w-[45%]' options='[{"value": "all", "lib": "Toutes les commandes"}, {"value": "inprogress", "lib": "En cours"}, {"value": "completed", "lib": "Préparées"}, {"value": "none", "lib": "Non préparées"}]'></sg-select>
                        </div>
                        <div class='flex justify-end'>
                            <sg-btn idname='btnFiltre' css='h-9 text-white bg-dblueBase px-3 rounded'>Rechercher</sg-btn>
                        </div>
                    </div>
                    <div id='toggleEntete' class='flex justify-center items-center bg-white shadow p-3 rounded-b w-36 h-9'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                </div>
                <div class='pt-12 px-3 pb-3'>
                    <sg-table idname='tableCmd' css="table sgTableColor" class='bg-white h-full rounded-t-2xl'></sg-table> 
                </div>

                <div id='modal' class='p-24 hidden fixed top-0 left-0 right-0 z-50 w-full h-full bg-white'>
                    <div id='closeModal' class='absolute top-12 right-12'><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></div>
                    <div id='modalContent' class='h-full'></div>
                </div>
            </main>
        `;
    }
}
customElements.define('home-page', HomePage);