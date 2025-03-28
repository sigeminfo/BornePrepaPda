import '../components/TableClassic.js';
import '../components/Btn.js';
import '../components/Input.js';
import { getUrlParameter } from '../utils/lib.js';
import { Global } from '../models/globalModel.js';

import { lessColis } from '../utils/lib.js';

export class LignesPage extends HTMLElement {
    constructor() {
        super();
        this.globalModel = new Global();
        this.isEnteteVisible = false;
        this.facNbl = getUrlParameter('nbl');
        this.scanTimer;
    }

    connectedCallback() {
        this.render();
        this.initialize();
    }

    initialize() {
        if (this.facNbl) {
            this.loadLignesData(this.facNbl);
        }

        const dateElement = document.getElementById('dateFiltre');
        const clientElement = document.getElementById('cliFiltre');
        const commandeElement = document.getElementById('comFiltre');

        if (dateElement && clientElement) {
            const sessionDate = sessionStorage.getItem('date');
            const sessionClient = sessionStorage.getItem('client');
            const sessionCommande = sessionStorage.getItem('nbl');
            if (sessionDate) {
                dateElement.value = sessionDate;
            }
            if (sessionClient) {
                clientElement.value = sessionClient;
            }
            if (sessionCommande) {
                commandeElement.value = sessionCommande;
            }
        }
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('toggleEntete').addEventListener('click', this.toggleEntete.bind(this));

        document.getElementById('clodeModal').addEventListener('click', () => {
            document.getElementById('modal').classList.add('hidden');
            document.getElementById('modalContent').innerHTML = '';
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
            entete.style.transform = 'translateY(-6.75rem)';
            chevron.style.transform = 'rotate(180deg)';
        }
    }

    async loadLignesData(facNbl) {
        try {
            //console.log(facNbl);
            this.lignes = await this.globalModel.getFacLig(facNbl);

            if (this.lignes && this.lignes.length > 0) {
                const tableData = this.formatTable();
                //console.log(tableData);
                let tableElement = this.querySelector('[idname="tableLignes"]');
                //console.log(tableElement);
                const jsonData = JSON.stringify(tableData);
                tableElement.setAttribute('data', jsonData);

                setTimeout(() => {
                    const tableRows = tableElement.querySelectorAll('tbody tr:not(.comment-row)');
                    //console.log(tableRows);
                    tableRows.forEach(row => {
                        row.addEventListener('click', (e) => {
                            if (row.dataset.ligne) {
                                const ligne = JSON.parse(row.dataset.ligne);
                                this.handleConfirmRow(ligne);
                            }
                        });
                    });
                }, 100);
            } else {
                console.warn("Pas de ligne retournée");
            }
        } catch (error) {
            console.error("Error loading lignes data:", error);
        }
    }

    formatTable() {
        if (!this.lignes || !Array.isArray(this.lignes)) {
            return { thead: [], tbody: [] };
        }

        let stateB = document.createElement('div');
        stateB.className = 'bg-lblueBase/20 rounded-full flex items-center justify-center w-[35px] h-[35px]';
        let sousStateB = document.createElement('div');
        sousStateB.className = 'bg-lblueBase rounded-full w-[25px] h-[25px]';
        stateB.appendChild(sousStateB);

        let btnsStateB = document.createElement('div');
        let btnsStateO = document.createElement('div');
        let btnsStateNull = document.createElement('div');
        btnsStateO.className = 'flex items-center gap-1.5';
        btnsStateB.className = 'flex items-center gap-1.5';
        btnsStateNull.className = 'flex items-center gap-1.5';

        let btnImp = document.createElement('button');
        btnImp.className = 'imp bg-dblueBase text-white rounded w-[50px] h-[50px] flex items-center justify-center';
        btnImp.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-printer-icon lucide-printer"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/></svg>';
        let btnConfirm = document.createElement('button');
        btnConfirm.className = 'confirm bg-dblueBase text-white rounded w-[50px] h-[50px] flex items-center justify-center';
        btnConfirm.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>';
        let btnManquant = document.createElement('button');
        btnManquant.className = 'manquant bg-dblueBase text-white rounded w-[50px] h-[50px] flex items-center justify-center';
        btnManquant.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert-icon lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
        let btnSuppr = document.createElement('button');
        btnSuppr.className = 'suppr bg-dblueBase text-white rounded w-[50px] h-[50px] flex items-center justify-center';
        btnSuppr.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>';

        btnsStateB.appendChild(btnConfirm);
        btnsStateB.appendChild(btnImp);
        btnsStateB.appendChild(btnSuppr);

        btnsStateO.appendChild(btnManquant);

        btnsStateNull.appendChild(btnConfirm);
        btnsStateNull.appendChild(btnManquant);
        btnsStateNull.appendChild(btnImp);
        btnsStateNull.appendChild(btnSuppr);

        let stateO = document.createElement('div');
        stateO.className = 'bg-orangeBase/20 rounded-full flex items-center justify-center w-[35px] h-[35px]';
        let sousStateO = document.createElement('div');
        sousStateO.className = 'bg-orangeBase rounded-full w-[25px] h-[25px]';
        stateO.appendChild(sousStateO);

        let stateNull = '';

        let tbody = []

        let rowIndex = 0;
        console.log(this.lignes);
        this.lignes.forEach(ligne => {
            // Main row with article data
            const bgColorClass = rowIndex % 4 < 2 ? '!bg-white' : '!bg-dblueLight';
            rowIndex += 2;
            const mainRow = {
                id: ligne.Art_cod,
                css: `${bgColorClass} hover:bg-dblueLightHover cursor-pointer`,
                attr: { 'data-ligne': JSON.stringify(ligne) },
                trData: [
                    { tdData: (ligne.Lf_prev != "" ? stateB.outerHTML : (ligne.Art_cod == '*' ? stateO.outerHTML : stateNull)), css: 'etat', type: '' },
                    { tdData: ligne.Lot_cod, css: 'lot', type: '' },
                    { tdData: (ligne.Lf_typ == 'K' ? ligne.Lf_poin : (ligne.Lf_typ == 'P' ? ligne.Lf_pito : ligne.Lf_col)), css: 'quantite text-right', type: '' },
                    { tdData: ligne.Lf_typ, css: 'unite', type: '' },
                    { tdData: ligne.Art_cod, css: 'artcod', type: '' },
                    { tdData: ligne.Art_lib, css: 'artlib', type: '' },
                    { tdData: (ligne.Lf_prev != "" ? btnsStateB.outerHTML : (ligne.Art_cod == '*' ? btnsStateO.outerHTML : btnsStateNull.outerHTML)), css: 'action', type: '' }
                ]
            };
            
            tbody.push(mainRow);
            
            let commentText = '';
            if (ligne.Lf_coin && ligne.Lf_coin.trim() !== '') {
                commentText = ligne.Lf_coin.split('#')[0] || ligne.Lf_coin;
            }
            const commentRow = {
                id: ligne.Art_cod + '_comment',
                css: `comment-row bg-gray-100 ${bgColorClass} ${commentText.trim() === '' ? 'hidden' : ''}`,
                trData: [
                    { 
                        tdData: `<div class="text-gray-700">Commentaire : ${commentText}</div>`, 
                        css: 'comment-cell', 
                        type: 'html',
                        attr: { colspan: 6 }
                    }
                ]
            };
            tbody.push(commentRow);
        });

        return {
            thead: [
                { lib: 'État' },
                { lib: 'Lot', css: 'text-right' },
                { lib: 'Qté', css: 'text-right' },
                { lib: 'U' },
                { lib: 'Code Article' },
                { lib: 'Libellé' },
                { lib: 'Action' }
            ],
            tbody: tbody
        };
    }

    handleConfirmRow(detail) {
        if (detail.Lot_cod == 0 || detail.Lfl_lig == 0) {
            this.scanLotModal(detail);
            return;
        } else {
            this.pesee(detail);
        }
    }

    scanLotModal(detail) {
        document.getElementById('modal').classList.remove('hidden');
        document.getElementById('modalContent').innerHTML = '';
        let html = `
            <div class='w-[500px] mb-6'>
                <h3 class='font-bold text-3xl mb-3'>Scanner un lot</h3>
                <div class='relative'>
                    <sg-input input='number' idname='inpScanLot' inputCss='h-20 !rounded-md px-6 text-xl' placeholder='Numéro de lot'></sg-input>
                    <div class='absolute right-6 bottom-0 h-20 !rounded-md flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scan-barcode-icon lucide-scan-barcode"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 7v10"/><path d="M12 7v10"/><path d="M17 7v10"/></svg></div>
                </div>
            </div>
            <div class='w-[500px]'>
                <sg-btn idname='saisieManuelle' css='bg-dblueBase text-white rounded-md w-full h-20 font-semibold text-2xl'>Saisie Manuelle</sg-btn>
            </div>
        `;
        document.getElementById('modalContent').innerHTML = html;

        document.getElementById('inpScanLot').focus();
        document.getElementById('inpScanLot').addEventListener('input', (event) => {
            this.handleScan(event, JSON.stringify(detail));
        });
        document.getElementById('saisieManuelle').addEventListener('click', () => {
            this.getStockRow(JSON.stringify(detail));
        });
    }

    pesee(detail) {
        console.log(detail);
        document.getElementById('modal').classList.remove('hidden');
        document.getElementById('modalContent').innerHTML = '';
        const html = `
            <div class='flex flex-col gap-10'>
                <div class='flex w-full items-end gap-6'>
                    <div class='flex w-[45%] items-end'>
                        <sg-input idname='colis' label='Colis' input='text' inputCss='!rounded-l-md !h-14 px-4' class='grow' value=${detail.Lf_col}></sg-input>
                        <sg-btn idname='moinsCol' css='bg-dblueBase text-white rounded-r-md w-14 !h-14 flex items-center justify-center'>-</sg-btn>
                    </div>
                    <sg-input idname='poidsnet' label='Poids Net' input='number' inputCss='!h-14 rounded-md px-4' class='w-[45%]' value=${detail.Lf_poin}></sg-input>
                </div>

                <!--<div class='flex w-full gap-6'>
                    <sg-input idname='tare' label='Tare' input='number' inputCss='!h-14 rounded-md px-4' class='w-[45%]' value=${detail.Lf_tar}></sg-input>
                    <sg-input idname='tarep' label='Tare Palette' input='number' inputCss='!h-14 rounded-md px-4' class='w-[45%]' value=${detail.Lf_tarp}></sg-input>
                </div>

                <div class='flex w-full gap-6'>
                    <sg-input idname='poidsbrut' label='Poids Brut' input='number' inputCss='!h-14 rounded-md px-4' class='w-[45%]' value=${detail.Lf_poib}></sg-input>
                    <sg-input idname='poidsnet' label='Poids Net' input='number' inputCss='!h-14 rounded-md px-4' class='w-[45%]' value=${detail.Lf_poin}></sg-input>
                </div>-->

                <div class='flex w-full gap-6'>
                    <sg-btn idname='validPesee' css='bg-dblueBase text-white rounded-md w-full !h-14 text-xl font-semibold' class='w-[45%]'>Valider</sg-btn>
                    <sg-btn idname='remiseDefaut' css='bg-white border border-dblueBase text-dblueBase rounded-md w-full !h-14 text-xl font-semibold' class='w-[45%]'>Remise par défaut</sg-btn>
            </div>
        `;
        document.getElementById('modalContent').innerHTML = html;

        document.getElementById('validPesee').addEventListener('click', () => {
            this.updateFacLig(detail);
        });
        document.getElementById('remiseDefaut').addEventListener('click', () => {
            this.pesee(detail);
        });

        document.getElementById('moinsCol').addEventListener('click', () => {
            lessColis();
        });
    }

    updateFacLig(detail) {
        const colis = document.getElementById('colis').value;
        const tare = document.getElementById('tare').value;
        const tarep = document.getElementById('tarep').value;
        const poidsbrut = document.getElementById('poidsbrut').value;
        const poidsnet = document.getElementById('poidsnet').value;

        detail.Lf_col = colis;
        detail.Lf_tar = tare;
        detail.Lf_tarp = tarep;
        detail.Lf_poib = poidsbrut;
        detail.Lf_poin = poidsnet;
        detail.Lf_tagc = sessionStorage.getItem('client');

        this.globalModel.updFacLig(detail)
            .then(response => {
                console.log("Success :", response);
                document.getElementById('modal').classList.add('hidden');
                document.getElementById('modalContent').innerHTML = '';
                this.loadLignesData(this.facNbl);
            })
            .catch(error => {
                console.error("Error updating line:", error);
            });
    }

    handleScan(event, detail) {
        // Annuler le timer précédent s'il existe
        if (this.scanTimer) {
            clearTimeout(this.scanTimer);
        }
        
        // Créer un nouveau timer
        this.scanTimer = setTimeout(() => {
            const scannedValue = event.target.value;
            detail = JSON.parse(detail);
            if (scannedValue) {
                //console.log("Scanned value:", scannedValue);
                const audio = new Audio('public/sons/bip.mp3');
                audio.volume = 0.2;
                audio.play();
                this.globalModel.getIntStk(detail.Fac_nbl, detail.Lf_lig)
                    .then(response => {
                    //console.log(response);
                        if (response?.dsStk?.dsStk?.ttStk[0].lot_cod == scannedValue) {
                            this.confirmStockRow(JSON.stringify(detail),JSON.stringify(response.dsStk?.dsStk?.ttStk[0]));
                        } else {
                            this.noStockLot(JSON.stringify(detail));
                        }
                    })
            }
        }, 20); // Délai de 20ms après la dernière saisie
    }

    getStockRow(detail) {
        detail = JSON.parse(detail);
        document.getElementById('modalContent').innerHTML = '';
        document.getElementById('modal').classList.remove('hidden');

        this.globalModel.getIntStk(detail.Fac_nbl, detail.Lf_lig)
            .then(response => {
                //console.log(data);
                let stocks = response?.dsStk?.dsStk?.ttStk || [];
                let html;
                html = `
                    <div>
                        <div>
                            <sg-table idname='prepaTabStock' css='table sgTableBorder' class='bg-white h-full rounded-t-2xl'></sg-table>
                        </div>
                    </div>
                `;

                document.getElementById('modalContent').innerHTML = html;

                this.querySelector('[idname="prepaTabStock"]').setAttribute('data', JSON.stringify(this.formatTableStock(stocks)));
            })
    }

    formatTableStock(stocks) {
        return {
            thead: [
                { lib: 'Ent' },
                { lib: 'Lot' },
                { lib: 'Fournisseur' },
                { lib: 'Article' },
                { lib: 'Libellé' },
                { lib: 'Marque' },
                { lib: 'Colis' },
                { lib: 'P. Net' },
            ],
            tbody:
                stocks && stocks.map(val => ({
                    id: val.lot_cod,
                    trData: [
                        { tdData: val.ent_cod, css: 'ent', type: '' },
                        { tdData: val.lot_cod, css: 'lot', type: '' },
                        { tdData: val.fou_nom, css: 'fournisseur', type: '' },
                        { tdData: val.art_cod, css: 'article', type: '' },
                        { tdData: val.art_lib, css: 'libelle', type: '' },
                        { tdData: val.art_libc, css: 'marque', type: '' },
                        { tdData: val.colis, css: 'colis', type: '' },
                        { tdData: val.poids, css: 'poidsnet', type: '' },
                    ]
                }))
        }
    }

    noStockLot(detail) {
        detail = JSON.parse(detail);
        document.getElementById('modalContent').innerHTML = '';
        document.getElementById('modal').classList.remove('hidden');

        let html;

        this.globalModel.getIntStk(detail.Fac_nbl, detail.Lf_lig)
            .then(response => {
                let stocksArt = response?.dsStk?.dsStk?.ttStk || [];

                html = `
                    <div>
                        <h3 class='flex gap-3 items-center mb-3'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> L'article initial n'est plus en stock. Voici la liste des articles de la même famille disponibles.</h3>
                        <div>
                            <sg-table idname='prepaTabStock' css='table sgTableBorder' class='bg-white h-full rounded-t-2xl'></sg-table>
                        </div>
                    </div>`;

                    document.getElementById('modalContent').innerHTML = html;

                    this.querySelector('[idname="prepaTabStock"]').setAttribute('data', JSON.stringify(this.formatTableStock(stocksArt)));
            });
    }

    confirmStockRow(detail, lot) {
        detail = JSON.parse(detail);

        $.confirm({
            title: 'Confirmation Lot',
            content: 'Confirmez-vous la sélection du lot ' + lot.lot_cod + ' ?',
            buttons: {
                Confirmer: function () {
                    this.globalModel.setStk(detail.Fac_nbl, detail.Lf_lig, lot.lot_cod, detail.LflLig)
                       .then(response => {
                           detail.Lot_cod = response.response.iLot_cod;
                           detail.LflLig = response.response.iLfl_lig;

                           let rowLf = document.getElementById('tableLignes').getElementsByClassName('prepa-lf');
                           [...rowLf].forEach(tr => {
                                if (tr.dataset.facNbl == detail.Fac_nbl && tr.dataset.lflLig == detail.Lf_lig) {
                                    tr.setAttribute('onclick', `this.confirmRow(${JSON.stringify(detail)})`);
                                }
                           });

                           document.getElementById('modal').classList.add('hidden');
                           document.getElementById('modalContent').innerHTML = '';
                           this.loadLignesData(detail.Fac_nbl);
                       })
                },
                Annuler: function () {
                    document.getElementById('modal').classList.add('hidden');
                    document.getElementById('modalContent').innerHTML = '';
                }
            }
        })
    }

    render() {
        this.innerHTML = `
            <main id='main' role='main' class='h-full flex flex-col relative'>
                <div id='entete' class='flex flex-col items-center w-full absolute top-0 left-0 right-0 z-10 -translate-y-[6.75rem]'>
                    <div class='bg-white shadow p-3 w-full flex flex-col gap-3'>
                        <div class='flex justify-between'>
                            <sg-input idname='cliFiltre' label='Client' placeholder='Nom du client' input='text' inputCss='grow bg-gray-200 opacity-60' class='w-[45%]' disabled='true'></sg-input>
                            <sg-input idname='comFiltre' label='N° Commande' placeholder='N° Commande' input='text' inputCss='grow bg-gray-200 opacity-60' class='w-[45%]' disabled='true'></sg-input>
                        </div>
                        <div class='flex justify-between'>
                            <sg-input idname='dateFiltre' label='Date' input='date' inputCss='grow bg-gray-200 opacity-60' class='w-[45%]' disabled='true'></sg-input>
                        </div>
                    </div>
                    <div id='toggleEntete' class='flex justify-center items-center bg-white shadow p-3 rounded-b w-36 h-9'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                </div>
                <div class='pt-12 px-3 pb-3'>
                    <sg-table idname='tableLignes' css="table" class='bg-white h-full rounded-t-2xl'></sg-table> 
                </div>

                <div id='modal' class='p-24 hidden fixed top-0 left-0 right-0 z-50 w-full h-full bg-white'>
                    <div id='clodeModal' class='absolute top-12 right-12'><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></div>
                    <div id='modalContent'></div>
                </div>
            </main>
        `;
    }

}
customElements.define('lignes-page', LignesPage);