# Installation & utilisation

npm install

## Commandes

Lancer l'appli :

- npm run dev

Build l'appli dans le dossier dist :

- npm run build

Lancer le dist pour voir la preview :

- npm run preview

# Organisation du projet

## Répertoires

### /dist

- dossier contenant le build de l'application

### /public

- dossier contenant tous les fichiers statiques :
  - un dossier images contenant tous les fichiers images, les logo et les icons ont leur propre dossier à l'intérieur du dossier pour plus de clarté
  - un dossier json
  - Possibilité d'ajouter un dossier font et un dossier audio/video si besoin

### /src

- dossier contenant tous les fichiers sources :
  - css : dossier contenant tous les fichiers css
  - components : dossier contenant tous les composants utilisables
  - pages : dossier contenant toutes les views, traitées comme composants pages
  - models : class faisant lien avec l'API/bdd
  - services : dossier contenant tous les services utilisables comme les api ou les services de login
  - utils : dossier contenant tous les utilitaires
  - router.js : fichier contenant la gestion des routes

### /node_modules : dossier contenant tous les modules npm

### /package.json : fichier contenant toutes les dépendances du projet

### /.env.development et /.env.production : fichiers contenant les URL API notamment

### /tailwind.config.js : fichier permettant d'ajouter des règles CSS personnalisées à Tailwindcss

## Librairie CSS <img src='public/img/logos/tailwind.svg' width="250">

- L'application utilise la librairie CSS Tailwindcss : [documentation](https://tailwindcss.com/docs/installation)

# Contenu technique

## Les routes API

### /getAllCuves
/getAllCuves (GET) : Récupération de toute les cuves

### /getCuveStock
/getCuveStock (GET) : Récupération du stock d'une cuve

INPUT :
- cuve_cod

Exemple :
<span style="color:#8E0000;">'cuve_cod'</span> : cuve_cod

### /updateCuveStock
/updateCuveStock (PUT) : Ajoute un article à une cuve (peut être de lot différent de celui déjà présent, tant que c'est le même article)

INPUT : 
- lot_cod
- lfl_lig
- poin
- cuve_cod

Exemple : 
{
  <span style="color:#8E0000;">"request"</span> : {
    <span style="color:#8E0000;">"IOjson"</span> : {
      <span style="color:#8E0000;">"lot_cod"</span> : <span style="color:#0B489D;">1</span>,
      <span style="color:#8E0000;">"lfl_lig"</span> : <span style="color:#0B489D;">1</span>,
      <span style="color:#8E0000;">"poin"</span> : <span style="color:#0B489D;">1000</span>,
      <span style="color:#8E0000;">"cuve_cod"</span> : <span style="color:#0B489D;">"C1"</span>
    }
  }
}

### /cancelUpdate
/cancelupdate (PUT) : Retire un article de la cuve

INPUT :
- lot_cod
- lfl_lig
- point
- cuve_cod

Exemple : 
{
  <span style="color:#8E0000;">"request"</span> : {
    <span style="color:#8E0000;">"IOjson"</span> : {
      <span style="color:#8E0000;">"lot_cod"</span> : <span style="color:#0B489D;">1</span>,
      <span style="color:#8E0000;">"lfl_lig"</span> : <span style="color:#0B489D;">1</span>,
      <span style="color:#8E0000;">"poin"</span> : <span style="color:#0B489D;">1000</span>,
      <span style="color:#8E0000;">"cuve_cod"</span> : <span style="color:#0B489D;">"C1"</span>
    }
  }
}

### /getStock
/getStock (GET) : Renvoi tous les articles en stock

### /emptyCuve
/emptyCuve (PUT) : Vide une cuve

INPUT : 
- cuve_cod

Exemple : 
{
  <span style="color:#8E0000;">"request"</span> : {
    <span style="color:#8E0000;">"IOjson"</span> : {
      <span style="color:#8E0000;">"cuve_cod"</span> : <span style="color:#0B489D;">"C1"</span>
    }
  }
}

### /getEnt
/getEnt (GET) : Permet de récupérer tous les entrepôts (utilisé por la recherche dynamique)

### /getArt
/getArt (GET) : Permet de récupérer tous les articles (utilisé por la recherche dynamique)
