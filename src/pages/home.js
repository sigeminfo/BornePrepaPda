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
        document.getElementById('btnFiltre').addEventListener('click', this.getFac.bind(this));
        document.getElementById('lessDateBtn').addEventListener('click', lessDate);
        document.getElementById('moreDateBtn').addEventListener('click', moreDate);
        document.getElementById('stateFiltre').addEventListener('change', this.filterTableByState.bind(this));
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
                if (facNbl) {
                        impression(facNbl, 'BL');
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
                { lib: 'N° de commande', css: 'text-right' },
                { lib: 'Client'},
                { lib: 'Lignes préparées', css: 'text-right'},
                { lib: 'Tournées' },
                { lib: 'Action' }
            ],
            tbody:
                this.fac && this.fac.map(val => {
                    let rowClass = '';
                    if (parseInt(val.nbCdePrep) === parseInt(val.nbLig)) {
                        rowClass = 'cmdCompleted';
                    } else {
                        rowClass = 'cmdInProgress';
                    }

                    return {
                        id: val.fac_nbl,
                        css: rowClass,
                        trData: [
                            { tdData: new Date(val.datebl).toLocaleDateString('fr-FR', options), css: 'date', type: '' },
                            { tdData: val.fac_nbl, css: 'commande text-right', type: '' },
                            { tdData: val.cli_nom, css: 'client', type: '' },
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
                            <sg-select idname='stateFiltre' label='État commande' selectCss='grow' class='w-[45%]' options='[{"value": "all", "lib": "Toutes les commandes"}, {"value": "inprogress", "lib": "En cours"}, {"value": "completed", "lib": "Préparées"}]'></sg-select>
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
            </main>
        `;
    }
}
customElements.define('home-page', HomePage);