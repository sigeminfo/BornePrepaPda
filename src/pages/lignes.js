import '../components/TableClassic.js';
import '../components/Btn.js';
import '../components/Input.js';
import { getUrlParameter, impression } from '../utils/lib.js';
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
        
        document.getElementById('goBack').addEventListener('click', () => {
            window.location.hash = '/prepa';
        });
        document.getElementById('toggleEntete').addEventListener('click', this.toggleEntete.bind(this));

        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('modal').classList.add('hidden');
            document.getElementById('modalContent').innerHTML = '';
        });

        window.addEventListener("click", (e) => {
            if (e.target != document.getElementById("impFrame")) {
                let printFrame = document.getElementById("impFrame");
                printFrame.style.display = "none";
                printFrame.src = "";
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
            entete.classList.add('z-50');
        } else {
            entete.style.transform = 'translateY(-6.75rem)';
            chevron.style.transform = 'rotate(180deg)';
            entete.classList.remove('z-50');
        }
    }

    async loadLignesData(facNbl) {
        try {
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

                    // Ajout de l'event aux boutons "manquant"
                    const manquantButtons = tableElement.querySelectorAll('.manquant');
                    manquantButtons.forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.stopPropagation(); // Prevent row click event
                            const row = btn.closest('tr');
                            if (row && row.dataset.ligne) {
                                const ligne = JSON.parse(row.dataset.ligne);
                                const isManquant = btn.parentElement.dataset.manquant;
                                (isManquant == 'true' ? this.setManquant(ligne.Fac_nbl, ligne.Lf_lig, true) : this.setManquant(ligne.Fac_nbl, ligne.Lf_lig));
                            }
                        });
                    });

                    // Ajout de l'event aux boutons "supprimer"
                    const supprButtons = tableElement.querySelectorAll('.supprLig');
                    supprButtons.forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.stopPropagation(); // Prevent row click event
                            const row = btn.closest('tr'); 
                            if (row && row.dataset.ligne) {
                                const ligne = JSON.parse(row.dataset.ligne);
                                this.delFacLig(ligne.Fac_nbl, ligne.Lf_lig);
                            }
                        });
                    });

                    // Ajout de l'event aux boutons "imprimer"
                    const imprBoutons = tableElement.querySelectorAll('.ligImpEtiq');
                    imprBoutons.forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            const row = btn.closest('tr');
                            if (row && row.dataset.ligne) {
                                const ligne = JSON.parse(row.dataset.ligne);
                                impression(ligne.Fac_nbl, 'etiq');
                            }
                        })
                    })
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
        btnsStateO.dataset.manquant = true;
        let btnsStateNull = document.createElement('div');
        
        btnsStateO.className = 'flex items-center gap-1.5';
        btnsStateB.className = 'flex items-center gap-1.5';
        btnsStateNull.className = 'flex items-center gap-1.5';

        let btnImpNull = document.createElement('button');
        let btnImpB = document.createElement('button');
        btnImpNull.className = 'ligImpEtiq bg-dblueBase text-white rounded w-[50px] h-[50px] flex items-center justify-center';
        btnImpNull.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-printer-icon lucide-printer"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/></svg>';
        btnImpB.className = 'ligImpEtiq bg-dblueBase text-white rounded w-[50px] h-[50px] flex items-center justify-center';
        btnImpB.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-printer-icon lucide-printer"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/></svg>';
        
        let btnConfirmNull = document.createElement('button');
        let btnConfirmB = document.createElement('button');
        btnConfirmNull.className = 'confirm bg-dblueBase text-white rounded w-[50px] h-[50px] flex items-center justify-center';
        btnConfirmNull.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>';
        btnConfirmB.className = 'confirm bg-dblueBase text-white rounded w-[50px] h-[50px] flex items-center justify-center';
        btnConfirmB.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>';
        
        let btnManquantO = document.createElement('button');
        let btnManquantNull = document.createElement('button');
        btnManquantO.className = 'manquant bg-dblueBase text-white rounded w-[50px] h-[50px] flex items-center justify-center';
        btnManquantO.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert-icon lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
        btnManquantNull.className = 'manquant bg-dblueBase text-white rounded w-[50px] h-[50px] flex items-center justify-center';
        btnManquantNull.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert-icon lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
        
        let btnSupprB = document.createElement('button');
        let btnSupprNull = document.createElement('button');
        btnSupprB.className = 'supprLig bg-dblueBase text-white rounded w-[50px] h-[50px] flex items-center justify-center';
        btnSupprB.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>';
        btnSupprNull.className = 'supprLig bg-dblueBase text-white rounded w-[50px] h-[50px] flex items-center justify-center';
        btnSupprNull.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>';

        btnsStateB.appendChild(btnConfirmB);
        btnsStateB.appendChild(btnImpB);
        btnsStateB.appendChild(btnSupprB);

        btnsStateO.appendChild(btnManquantO);

        btnsStateNull.appendChild(btnConfirmNull);
        btnsStateNull.appendChild(btnManquantNull);
        btnsStateNull.appendChild(btnImpNull);
        btnsStateNull.appendChild(btnSupprB);

        let stateO = document.createElement('div');
        stateO.className = 'bg-orangeBase/20 rounded-full flex items-center justify-center w-[35px] h-[35px]';
        let sousStateO = document.createElement('div');
        sousStateO.className = 'bg-orangeBase rounded-full w-[25px] h-[25px]';
        stateO.appendChild(sousStateO);

        let stateNull = '';

        let tbody = []

        let rowIndex = 0;

        const ordre = {
            'C':1,
            'P':2,
            'K':3
        }
    
        this.lignes.sort((a, b) => ordre[a.Lf_typ] - ordre[b.Lf_typ]).forEach(ligne => {
            console.log(ligne);
            // Main row with article data
            const bgColorClass = rowIndex % 4 < 2 ? '!bg-white' : '!bg-dblueLight';
            rowIndex += 2;
            const mainRow = {
                id: ligne.Art_cod,
                css: `${bgColorClass} hover:bg-dblueLightHover cursor-pointer`,
                attr: { 'data-ligne': JSON.stringify(ligne) },
                trData: [
                    { tdData: (ligne.Lf_prev != "" ? stateB.outerHTML : (ligne.Art_cod == '*' ? stateO.outerHTML : stateNull)), css: 'etat', type: '' },
                    { tdData: ligne.Lot_cod, css: 'lot text-right' + (ligne.Lfl_lig == 0 ? ' text-red-500' : ''), type: '' },
                    { tdData: (ligne.Lf_typ == 'K' ? (ligne.Lf_poin ? (Math.ceil(parseFloat(ligne.Lf_poin) * 100) / 100).toFixed(1) : '0.0') : (ligne.Lf_typ == 'P' ? ligne.Lf_pito : ligne.Lf_col)), css: 'quantite text-right', type: '' },
                    { tdData: ligne.Lf_typ, css: 'unite', type: '' },
                    { tdData: ligne.Art_cod, css: 'artcod', type: '' },
                    { tdData: ligne.Art_lib, css: 'artlib', type: '' },
                    { tdData: (ligne.Lf_prev != "" ? btnsStateB.outerHTML : (ligne.Art_cod == '*' ? btnsStateO.outerHTML : btnsStateNull.outerHTML)), css: 'action', type: '' }
                ]
            };
            
            tbody.push(mainRow);
            
            let commentText = '';
            if (ligne.Lf_coin && ligne.Lf_coin.trim() !== '') {
                commentText = ligne.Lf_coin.split('#')[0];
            } else {
                commentText = ligne.Lf_coin;
            }
            const commentRow = {
                id: ligne.Art_cod + '_comment',
                css: `comment-row bg-gray-100 ${bgColorClass} ${commentText.trim() === '' ? 'hidden' : ''}`,
                trData: [
                    {
                        tdData: '',
                        attr: { colspan: 5}
                    },
                    { 
                        tdData: `<div class="text-gray-700 font-black">Commentaire : ${commentText}</div>`, 
                        css: 'comment-cell', 
                        type: 'html',
                        attr: { colspan: 2 }
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
                    <sg-input input='number' idname='inpScanLot' inputCss='!h-20 !rounded-md px-6 text-xl' placeholder='Numéro de lot'></sg-input>
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
        //console.log(detail);
        document.getElementById('modal').classList.remove('hidden');
        document.getElementById('modalContent').innerHTML = '';

        const roundedPoidsNet = detail.Lf_poin ? Math.ceil(parseFloat(detail.Lf_poin) * 100) / 100 : 0;
        const formattedPoidsNet = roundedPoidsNet.toFixed(1);

        const html = `
            <div class='flex flex-col gap-10'>
                <div class='flex w-full items-end gap-6'>
                    <div class='flex w-[45%] items-end'>
                        <sg-input idname='colis' label='Colis' input='text' inputCss='!rounded-l-md !h-14 px-4' class='grow' value=${detail.Lf_col}></sg-input>
                        <sg-btn idname='moinsCol' css='bg-dblueBase text-white rounded-r-md w-14 !h-14 flex items-center justify-center'>-</sg-btn>
                    </div>
                    <sg-input idname='poidsnet' label='Poids Net' input='number' inputCss='!h-14 rounded-md px-4' class='w-[45%] ${detail.Lf_typ == 'P' ? 'hidden' : ''}' value=${formattedPoidsNet} step="0.01"></sg-input>
                    <sg-input idname='pieces' label='Pièces Totales' input='number' inputCss='!h-14 rounded-md px-4' class='w-[45%] ${detail.Lf_typ == 'K' || detail.Lf_typ == 'C' ? 'hidden' : ''}' value=${detail.Lf_pito} step="1"></sg-input>
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
        const pieces = document.getElementById('pieces').value;
        //const tare = document.getElementById('tare').value;
        //const tarep = document.getElementById('tarep').value;
        //const poidsbrut = document.getElementById('poidsbrut').value;
        const poidsnet = document.getElementById('poidsnet').value;

        detail.Lf_col = colis;
        /*detail.Lf_tar = tare;
        detail.Lf_tarp = tarep;
        detail.Lf_poib = poidsbrut;*/
        detail.Lf_pito = pieces;
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
                    <div class='h-full'>
                        <div class='h-full overflow-y-scroll'>
                            <sg-table idname='prepaTabStock' css='table sgTableBorder' class='bg-white h-full rounded-t-2xl'></sg-table>
                        </div>
                    </div>
                `;

                document.getElementById('modalContent').innerHTML = html;

                const tableElement = this.querySelector('[idname="prepaTabStock"]');
                tableElement.setAttribute('data', JSON.stringify(this.formatTableStock(stocks)));

                setTimeout(() => {
                    const tableRows = tableElement.querySelectorAll('tbody tr');
                    tableRows.forEach(row => {
                        row.addEventListener('click', () => {
                            const lotId = row.dataset.id;
                            const selectedStock = stocks.find(stock => String(stock.lot_cod) === String(lotId));
                            if (selectedStock) {
                                this.confirmStockRow(JSON.stringify(detail), JSON.stringify(selectedStock));
                            }
                        });
                        // Add pointer cursor to indicate clickable rows
                        row.classList.add('cursor-pointer', 'hover:bg-gray-100');
                    });
                }, 100);
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
                    attr: { 'data-lfl': val.lfl_lig || '' },
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
                    <div class='h-full'>
                        <h3 class='flex gap-3 items-center mb-3'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> L'article initial n'est plus en stock. Voici la liste des articles de la même famille disponibles.</h3>
                        <div class='h-full overflow-y-scroll'>
                            <sg-table idname='prepaTabStock' css='table sgTableBorder' class='bg-white h-full rounded-t-2xl'></sg-table>
                        </div>
                    </div>`;

                    document.getElementById('modalContent').innerHTML = html;

                    const tableElement = this.querySelector('[idname="prepaTabStock"]');
                    tableElement.setAttribute('data', JSON.stringify(this.formatTableStock(stocksArt)));

                    setTimeout(() => {
                        const tableRows = tableElement.querySelectorAll('tbody tr');
                        tableRows.forEach(row => {
                            row.addEventListener('click', () => {
                                const lotId = row.dataset.id;
                                const selectedStock = stocksArt.find(stock => String(stock.lot_cod) === String(lotId));
                                if (selectedStock) {
                                    this.confirmStockRow(JSON.stringify(detail), JSON.stringify(selectedStock));
                                }
                            });
                            // Add pointer cursor to indicate clickable rows
                            row.classList.add('cursor-pointer', 'hover:bg-gray-100');
                        });
                    }, 100);
            });
    }

    confirmStockRow(detail, lot, lf = "") {
        detail = JSON.parse(detail);
        lot = JSON.parse(lot);

        const self = this;
        console.log(lot)
        $.confirm({
            title: 'Confirmation Lot',
            content: 'Confirmez-vous la sélection du lot ' + lot.lot_cod + ' ?',
            useBootstrap: false,
            boxWidth: '70%',
            buttons: {
                Confirmer: function () {
                    console.log(lf);
                    self.globalModel.setStk(detail.Fac_nbl, (lf ? lf : detail.Lf_lig), lot.lot_cod, lot.lfl_lig)
                        .then(response => {
                        console.log(response);
                           detail.Lot_cod = response.iLot_cod;
                           detail.LflLig = response.iLfl_lig;

                           let rowLf = document.getElementById('tableLignes').getElementsByClassName('prepa-lf');
                           [...rowLf].forEach(tr => {
                                if (tr.dataset.facNbl == detail.Fac_nbl && tr.dataset.lflLig == detail.Lf_lig) {
                                    tr.setAttribute('onclick', `this.confirmRow(${JSON.stringify(detail)})`);
                                }
                           });

                           document.getElementById('modal').classList.add('hidden');
                           document.getElementById('modalContent').innerHTML = '';
                           //window.location.reload();
                           console.log('test');
                           if (response.iLf_lig > 0 && response.iFac_nbl > 0) {
                               self.gestionReliquat(detail, JSON.stringify(response));
                           } else {
                               self.pesee(detail);
                           }
                           
                        })
                },
                Annuler: function () {
                    document.getElementById('modal').classList.add('hidden');
                    document.getElementById('modalContent').innerHTML = '';
                }
            }
        })
    }

    gestionReliquat(detail, response) {
        response = JSON.parse(response);
        document.getElementById('modalContent').innerHTML = '';
        document.getElementById('modal').classList.remove('hidden');

        let html;

        this.globalModel.getIntStk(response.iFac_nbl, response.iLf_lig)
        .then(resp => {
            let stocksArt = resp?.dsStk?.dsStk?.ttStk || [];
            html = `
                <div class='h-full'>
                    <h3 class='mb-3'>Gestion de reliquat</h3>
                    <div class='h-full overflow-y-scroll'>
                        <sg-table idname='prepaTabStock' css='table sgTableBorder' class='bg-white h-full rounded-t-2xl'></sg-table>
                    </div>
                </div>`;

                document.getElementById('modalContent').innerHTML = html;

                const tableElement = this.querySelector('[idname="prepaTabStock"]');
                tableElement.setAttribute('data', JSON.stringify(this.formatTableStock(stocksArt)));

                setTimeout(() => {
                    const tableRows = tableElement.querySelectorAll('tbody tr');
                    tableRows.forEach(row => {
                        row.addEventListener('click', () => {
                            const lotId = row.dataset.id;
                            const selectedStock = stocksArt.find(stock => String(stock.lot_cod) === String(lotId));
                            if (selectedStock) {
                                this.confirmStockRow(JSON.stringify(detail), JSON.stringify(selectedStock), response.iLf_lig);
                            }
                        });
                        // Add pointer cursor to indicate clickable rows
                        row.classList.add('cursor-pointer', 'hover:bg-gray-100');
                    });
                }, 100);
        });
    }

    setManquant(facNbl, lflLig, isManquant = false) {
        const self = this;
        $.confirm({
            title: (isManquant ? 'Annulation manquant' : 'Confirmation manquant'),
            content: (isManquant ? 'Êtes-vous sûr de vouloir annuler le manquant ?' : 'Êtes-vous sûr de vouloir passer cette ligne en manquant ?'),
            useBootstrap: false,
            boxWidth: '70%',
            buttons: {
                Confirmer: {
                    text: 'Confirmer Manquant',
                    action:function () {
                        self.globalModel.setManquant(facNbl, lflLig)
                            .then(response => {
                                console.log(response);
                                if (response && response.lOk == 'true') {
                                    //self.loadLignesData(facNbl);
                                    window.location.reload();
                                } else {
                                    console.warn("Opération terminée, mais aucune ligne n'a été retournée");

                                }
                            })
                    }
                },
                ...(isManquant ? {} : {
                    Remplacer: {
                        text: 'Remplacer Article',
                        action: function () {
                            self.getArtFromFam(facNbl, lflLig);
                        }
                    }
                }),
                Annuler: function () {

                }
            }
        })
    }

    async getArtFromFam(facNbl, lfLig) {
        const self = this;
        document.getElementById('modalContent').innerHTML = '';
        document.getElementById('modal').classList.remove('hidden');
        let html;

        this.globalModel.getArtFromFam(facNbl, lfLig)
            .then(response => {
                //console.log(response);
                let artsFromFam = response;
                    console.log(artsFromFam);
                    html = `
                        <div class='h-full'>
                            <h3 class='mb-3'>Souhaitez-vous remplacer l'article par un autre ?</h3>
                            <div class='overflow-y-scroll h-full'>
                                <sg-table idname='prepaTabStock' css='table sgTableBorder' class='bg-white h-full rounded-t-2xl'></sg-table>
                            </div>
                        </div>`;
                    document.getElementById('modalContent').innerHTML = html;

                    const tableElement = this.querySelector('[idname="prepaTabStock"]');
                    tableElement.setAttribute('data', JSON.stringify(this.formatTableStock(artsFromFam)));

                    setTimeout(() => {
                        const tableRows = tableElement.querySelectorAll('tbody tr');
                        tableRows.forEach(row => {
                            row.addEventListener('click', () => {
                                const data = JSON.parse(row.dataset.trData);
                                console.log(data);
                                $.confirm({
                                    title: 'Confirmation Article',
                                    content: 'Confirmez-vous la sélection de l\'article ' + data[4].tdData + ' ?',
                                    useBootstrap: false,
                                    boxWidth: '70%',
                                    buttons: {
                                        Confirmer: function () {
                                            self.setArt(facNbl, lfLig, data[1].tdData, row.dataset.lfl);
                                        },
                                        Annuler: function () {
                                            
                                        }
                                    }
                                })
                            });
                            // Add pointer cursor to indicate clickable rows
                            row.classList.add('cursor-pointer', 'hover:bg-gray-100');
                        });
                    }, 100);
            })
    }

    async setArt(facNbl, lfLig, lotCod, lflLig) {
        this.globalModel.setArt(facNbl, lfLig, lotCod, lflLig)
            .then(response => {
                console.log(response);
                if (response && response.lOk == 'true') {
                    window.location.reload();
                } else {
                    console.warn("Opération terminée, mais aucune ligne n'a été retournée");
                }
            })
    }

    async delFacLig(facNbl, lflLig) {
        const self = this;
        $.confirm({
            title: 'Suppression',
            content: 'Êtes-vous sûr de vouloir supprimer cette ligne ?',
            useBootstrap: false,
            boxWidth: '70%',
            buttons: {
                Confirmer: function () {
                    self.globalModel.delFacLig(facNbl, lflLig)
                       .then(response => {
                            console.log(response);
                            if (response && response.lOk == 'true') {
                               // window.location.reload(); 
                            }
                       })  
                },
                Annuler: function () {

                }
            }
        })
    }

    render() {
        this.innerHTML = `
            <main id='main' role='main' class='h-full flex flex-col relative'>
                <sg-btn idname='goBack' css='z-20 rounded-full bg-dblueBase w-10 h-10 flex justify-center items-center absolute top-1 left-3'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg></sg-btn>
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
                    <div id='closeModal' class='absolute top-12 right-12'><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></div>
                    <div id='modalContent' class='h-full'></div>
                </div>
            </main>
        `;
    }

}
customElements.define('lignes-page', LignesPage);