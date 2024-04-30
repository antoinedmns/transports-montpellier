(async () => {

    const resultatsArrets = await coordinateur.api.getAPI('api/arrets/reseau/');

    if(resultatsArrets == undefined) {
        console.log("CECI EST UNE ALERTE ROUGE");
    }

    /* on récupère la clé (nom de l'arrêt) de chaque élément du dictionnaire */
    const nomArrets = Object.keys(resultatsArrets);

    console.log(resultatsArrets);

    /* pour chacune des clés (donc chacun des arrêts) */
    nomArrets.forEach(arret => {

        /* je récupère l'id de la div parent dans lequel on va placé l'enfant (div avec le nom de l'arrêt) */
        const resultatRecherche = document.getElementById("res-recherche");

        /* création de la div enfant */
        const arretActuel = document.createElement("div");

        /* je donne l'attribut class='resultat-recherche hidden' */
        arretActuel.setAttribute("class", "resultat-recherche hidden");

        /* et à l'intérieur j'écris le nom de l'ârret*/
        arretActuel.innerHTML = arret;

        /* et je l'ajoute enfin à la page EJS */
        resultatRecherche.appendChild(arretActuel);

    })

    /* on récupère tout les éléments avec la classe resultat-recherche (ce sont tous les arrêts) */
    const arretsResultat  = document.querySelectorAll('.resultat-recherche');

    const headerDialog = document.getElementById("title-header-dialog");
    const bodyDialog = document.getElementById("body-dialog-box");
    const titreDialogue = document.createElement("h2");

    /* on parcourt chacun des arrêts */
    arretsResultat.forEach(arret => {

        /*quand on click sur l'arrêt choisi */
        arret.addEventListener('click', () => {

            titreDialogue.setAttribute("class", "second-title");

            /* et à l'intérieur j'écris le nom de l'ârret*/
            titreDialogue.innerHTML = arret.innerHTML;

            /* et je l'ajoute enfin à la page EJS */
            headerDialog.appendChild(titreDialogue);

            ouvrirDialogue("ligneInfo");

        });

    });

})();



const barreRecherche = document.getElementById('recherche');
const resultRecherche = document.getElementsByClassName('resultat-recherche');
const aucunResultat = resultRecherche[resultRecherche.length-1];


barreRecherche.addEventListener("keyup", (e) => {


    /* Barre de recherche active (première lettre relâché) */
    if(!barreRecherche.classList.contains("recherche-active") && barreRecherche.value.length > 0) {
        barreRecherche.classList.remove("recherche-inactive");
        barreRecherche.classList.add("recherche-active");
    }
    
    /* Barre de recherche inactive (plus de lettre dans la barre de recherche) */
    if(barreRecherche.value.length < 1) {

        barreRecherche.classList.remove("recherche-active");
        barreRecherche.classList.add("recherche-inactive");

        /* si la barre de recherche est inactive on cache tous les resultats */
        for(i = 0 ; i < resultRecherche.length ; i++){

            resultRecherche[i].classList.add("hidden");
        
        }
    
    /* Sinon (barre de recherche active + comparaison avec résultat) */
    } else {

        /* Booléen pour savoir si on a trouvé au moins 1 résultat pour notre recherche */
        let resultatTrouve = false;

        for(i = 0; i <resultRecherche.length ; i ++){

            /* Condition pour la comparaison entre notre recherche (barreRecherche) et tout les arrêts (resultRecherche) */
            if(resultRecherche[i].innerHTML.toUpperCase().includes(barreRecherche.value.toUpperCase()) && resultRecherche[i].innerHTML != "Aucun résultat trouvé") {
                resultatTrouve = true;
                resultRecherche[i].classList.remove("hidden");
            } 
            
            else {
                resultRecherche[i].classList.add("hidden");
            }
        }

        /* Si on a pas trouvé de résultat pour notre recherche alors on affiche la div "aucun résultat trouvé" */ 
        if (!resultatTrouve) {aucunResultat.classList.remove("hidden");}
    
    }



});

/* le prochain objectif est de rajouter un evenement sur chaque résultat de notre recherche qui fait que lorsque l'on clique sur la div qui nous correspond
une pop up s'affiche avec l'information sur l'arrêt choisi */