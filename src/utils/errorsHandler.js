export class ErrorsHandler {
    static handleError(error) {
        
        if (error._errors && error._errors[0]._errorNum === 777) {
            location.replace(`#/login`);
            //console.log("Erreur 777 - Token expiré");
        }
    }
}