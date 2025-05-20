import { ApiService } from "../services/apiService.js";
import { ErrorsHandler } from "../utils/errorsHandler.js";

export class Global {
    constructor() {
        // Initialisation de l'instance ApiService
        this.apiService = new ApiService();
        // Suffixe pour les requêtes API, pas besoin ici
        this.apiServiceSuffix = "/bePrep";
    }

    // Méthode de connexion 
    async connexion(id, mdp) {
        try {
            const data = {
                "request": {
                    "IOjson": {
                        "IOid": `${id}`,
                        "IOmdp": `${mdp}`
                    }
                }
            };
            const resp = await this.apiService.put(`${this.apiServiceSuffix}/cnx`, data );
            console.log(resp);
            if (!resp?.response) {
                throw new Error('Réponse invalide');
            }
            return resp?.response?.lCnx || [];
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async getFac(date, cliCod = '', artCod = '', touCod = '', facNbl = '') {
        try {
            const data = {
                "request": {
                    "IOjson": {
                        "IOcliCod": cliCod,
                        "IOartCod": artCod,
                        "IOdate": date,
                        "IOtouCod": touCod,
                        "IOfacNbl": facNbl
                    }
                }
            };
            console.log(data);
            const resp = await this.apiService.put(`${this.apiServiceSuffix}/getFac`, data );
            if (!resp?.response) {
                throw new Error('Réponse invalide');
            }
            return resp?.response?.dsFac?.dsFac?.ttFacTri || [];
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async getFacLig(facNbl) {
        try {
            const data = {
                "request": {
                    "IOjson": {
                        "IOfacNbl": facNbl
                    }
                }
            };
            const resp = await this.apiService.put(`${this.apiServiceSuffix}/getFacLig`, data );
            if (!resp?.response) {
                throw new Error('Réponse invalide');
            }
            return resp?.response?.dsFacLig?.dsFacLig?.ttFacLig || [];
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async getIntCli(cliCod) {
        try {
            const data = {
                "request": {
                    "IOjson": {
                        "IOcli": cliCod
                    }
                }
            }
            const resp = await this.apiService.put(`${this.apiServiceSuffix}/getIntCli`, data );
            if (!resp?.response) {
                throw new Error('Réponse invalide');
            }
            return resp?.response?.dsCli?.dsCli?.ttCli || []; 
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async getIntArt(artCod) {
        try {
            const data = {
                "request": {
                    "IOjson": {
                        "IOart": artCod
                    }
                }
            };
            const resp = await this.apiService.put(`${this.apiServiceSuffix}/getIntArt`, data );
            if (!resp?.response) {
                throw new Error('Réponse invalide');
            }
            return resp?.response?.dsArt?.dsArt?.ttArt || [];
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async getIntTou(touCod) {
        try {
            const data = {
                "request": {
                    "IOjson": {
                        "IOtou": touCod
                    }
                }
            };
            const resp = await this.apiService.put(`${this.apiServiceSuffix}/getIntTou`, data );
            if (!resp?.response) {
                throw new Error('Réponse invalide');
            }
            return resp?.response?.dsTou?.dsTou?.ttTou || [];
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async impression(facNbl, typeImp, append = false, nbEx = 1) {
        try {
            const data = {
                "request": {
                    "IOjson": {
                        "IOfacNbl": facNbl,
                        "IOappend": append,
                        "IOnbEx": nbEx
                    },
                    "IOquelPdf": typeImp
                }
            };
            const resp = await this.apiService.put(`${this.apiServiceSuffix}/impression`, data );
            if (!resp?.response) {
                throw new Error('Réponse invalide');
            }
            return resp?.response;
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async confirmOrder(facNbl) {
        try {
            const data = {
                "request": {
                    "IOjson": {
                        "IOfacNbl": facNbl
                    }
                }
            };
            const resp = await this.apiService.put(`${this.apiServiceSuffix}/confirmFac`, data );
            if (!resp?.response) {
                throw new Error('Réponse invalide');
            }
            return resp?.response;
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async updFacLig(json) {
        try {
            const data = {
                "request": {
                    "dsFacLig": {
                        "dsFacLig": {
                            "ttFacLig": [json]
                        }
                    }
                }
            };
            const resp = await this.apiService.put(`${this.apiServiceSuffix}/updFacLig`, data );
            if (!resp?.response) {
                throw new Error('Réponse invalide');
            }
            return resp?.response;
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async delFacLig(facNbl, lfLig) {
        try {
            const data = {
                "request": {
                    "IOjson": {
                        "IOfacNbl": `${facNbl}`,
                        "IOlfLig": `${lfLig}`
                    }
                }
            };
            const resp = await this.apiService.put(`${this.apiServiceSuffix}/delFacLig`, data );
            if (!resp?.response) {
                throw new Error('Réponse invalide');
            }
            return resp?.response;
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async updFacNumPal(data) {
        try {
            
            const sendData = {
                "request": {
                    "IOjson": {
                        "palettes": data
                    }
                }
            };
            
            
            console.log(data);

            const resp = await this.apiService.put(`${this.apiServiceSuffix}/setNumPal`, sendData);
            if (!resp?.response) {
                throw new Error('Réponse invalide');
            }
            return resp?.response;
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async setManquant(facNbl, lfLig) {
        try {
            const data = {
                "request": {
                    "IOjson": {
                        "IOfacNbl": `${facNbl}`,	
                        "IOlfLig": `${lfLig}`
                    }
                }
            };
            console.log(data);
            const resp = await this.apiService.put(`${this.apiServiceSuffix}/setManquant`, data );
            console.log(resp);
            if (!resp?.response) {
                throw new Error('Réponse invalide');
            }
            return resp?.response;
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async getIntStk(facNbl, lfLig) {
        try {
            const data = {
                "request": {
                    "IOjson": {
                        "IOfacNbl": `${facNbl}`,
                        "IOlfLig": `${lfLig}`
                    }
                }
            };
            console.log(data);
            const resp = await this.apiService.put(`${this.apiServiceSuffix}/getIntStk`, data );
            if (!resp?.response) {
                throw new Error('Réponse invalide');
            }
            return resp?.response;
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async setStk(facNbl, lfLig, lotCod, lflLig) {
        try {
            const data = {
                "request": {
                    "IOjson": {
                        "IOfacNbl": `${facNbl}`,
                        "IOlfLig": `${lfLig}`,
                        "IOlotCod": `${lotCod}`,
                        "IOlflLig": `${lflLig}`
                    }
                }
            };
            console.log(data);
            const resp = await this.apiService.put(`${this.apiServiceSuffix}/setStk`, data );
            if (!resp?.response) {
                throw new Error('Réponse invalide');
            }
            return resp?.response;
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async getArtFromFam(facNbl, lfLig) {
        try {
            const data = {
                "request": {
                    "IOjson": {
                        "IOfacNbl": `${facNbl}`,
                        "IOlfLig": `${lfLig}`
                    }
                }
            };
            const resp = await this.apiService.put(`${this.apiServiceSuffix}/getArtFromFam`, data );
            console.log(resp);
            if (!resp?.response?.dsStk?.dsStk?.ttStk) {
                throw new Error('Réponse invalide');
            }
            return resp?.response?.dsStk?.dsStk?.ttStk || [];
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async getInfos() {
        try {
            const data = {
                "request": {
                    "IOjson": {}
                }
            };
            const resp = await this.apiService.put(`${this.apiServiceSuffix}/getInfos`, data );
            if (!resp?.response) {
                throw new Error('Réponse invalide');
            }
            return resp?.response;
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async setArt(facNbl, lfLig, lotCod, lflLig) {
        try {
            const data = {
                "request": {
                    "IOjson": {
                        "IOfacNbl": `${facNbl}`,
                        "IOlfLig": `${lfLig}`,
                        "IOlotCod": `${lotCod}`,
                        "IOlflLig": `${lflLig}`
                    }
                }
            };
            console.log(data);
            const resp = await this.apiService.put(`${this.apiServiceSuffix}/setArt`, data );
            if (!resp?.response) {
                throw new Error('Réponse invalide');
            }
            return resp?.response;
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }
}