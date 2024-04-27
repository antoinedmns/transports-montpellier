(async () => {

    const resultatsArrets = await coordinateur.api.getAPI('api/arrets/reseau/');

    if(resultatsArrets == undefined) {
        console.log("CECI EST UNE ALERTE ROUGE");
    }

    const nomArrets = Object.keys(resultatsArrets);
    console.log(nomArrets);

    nomArrets.forEach(element => {

        const resultatRecherche = document.getElementById("res-recherche");
        const arretActuel = document.createElement("div");

        arretActuel.setAttribute("class", "resultat-recherche hidden");

        arretActuel.innerHTML = element;

        resultatRecherche.appendChild(arretActuel);

    })

})();



const barreRecherche = document.getElementById('recherche');
const resultRecherche = document.getElementsByClassName('resultat-recherche');
const aucunResultat = resultRecherche[resultRecherche.length-1];

/* On commence par cacher tout les arrêts */

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

        for(i = 0 ; i < resultRecherche.length ; i++){

            console.log(resultRecherche[i].innerHTML);
            resultRecherche[i].classList.add("hidden");
        
        }
    
    } else {

        let resultatTrouve = false;

        for(i = 0; i <resultRecherche.length ; i ++){


            if(resultRecherche[i].innerHTML.toUpperCase().includes(barreRecherche.value.toUpperCase()) && resultRecherche[i].innerHTML != "Aucun résultat trouvé") {
                resultatTrouve = true;
                resultRecherche[i].classList.remove("hidden");
            } 
            
            else {
                resultRecherche[i].classList.add("hidden");
            }
        }
        

        if (!resultatTrouve) {
            console.log(resultRecherche.length)
            console.log(resultatTrouve)
            
            aucunResultat.classList.remove("hidden");

            /*
            const resultatNull = document.getElementById("res-recherche");
            const divResultatNull = document.createElement("div");

            divResultatNull.setAttribute("class", "resultat-recherche");

            divResultatNull.innerHTML = "Aucun résultat trouvé";

            resultatNull.appendChild(divResultatNull);
            */



        }
    
    }



});

