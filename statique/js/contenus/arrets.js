(async () => {

    const resultatsArrets = await coordinateur.api.getAPI('api/arrets/reseau/');

    if(resultatsArrets == undefined) {
        console.log("CECI EST UNE ALERTE ROUGE");
    }

    /* on récupère la clé (nom de l'arrêt) de chaque élément du dictionnaire */
    const nomArrets = Object.keys(resultatsArrets);

    const arretsTram = infoLignes.tram;
    const arretsBusUrbain = infoLignes.suburbain;

    nomArrets.forEach(arret => {

        // Je récupère l'id de la div parent dans laquelle on va placer les enfants (div avec le nom de l'arrêt)
        const resultatRechercheConteneur = document.getElementById("res-recherche-conteneur");
    
        // Création des div enfants
        const arretActuelConteneur = document.createElement("div");
        const arretActuelNom = document.createElement("div");
        const arretActuelLogo = document.createElement("h3");
    
        // Je donne l'attribut class='resultat-recherche hidden' au conteneur de l'arrêt
        arretActuelConteneur.setAttribute("class", "resultat-recherche hidden");
    
        // Je donne les classes appropriées aux div du nom de l'arrêt et du logo
        arretActuelNom.setAttribute("class", "resultat-nom-arret");
        arretActuelLogo.setAttribute("class", "conteneur-resultat-logo");
    
        // J'insère le nom de l'arrêt dans sa div correspondante
        arretActuelNom.innerHTML = arret;

        let listeLigneArretActuel = [];
    
        // Je parcours les lignes associées à l'arrêt et crée un logo pour chacune d'elles
        for(ligne of resultatsArrets[arret].lignes) {
            if(!listeLigneArretActuel.includes(ligne)){
                const logoLigne = document.createElement("span");
                if(arretsTram.includes(ligne)){
                    logoLigne.setAttribute("class", `resultat-logo indicateur-ligne tramway ligne-${ligne}`);
                    logoLigne.innerHTML = "T"+ligne;
                }
                else if(arretsBusUrbain.includes(ligne)){
                    logoLigne.setAttribute("class", `resultat-logo indicateur-ligne busMTP ligne-${ligne}`);
                    logoLigne.innerHTML = ligne;
                }
                else {
                    logoLigne.setAttribute("class", `resultat-logo indicateur-ligne bus3M ligne-${ligne}`);
                    logoLigne.innerHTML = ligne;
                }
                arretActuelLogo.appendChild(logoLigne);// J'ajoute chaque logo à la div contenant les logos
                listeLigneArretActuel.push(ligne);

            }
        };
    
        // J'ajoute les div du nom de l'arrêt et des logos à la div du conteneur parent
        arretActuelConteneur.appendChild(arretActuelNom);
        arretActuelConteneur.appendChild(arretActuelLogo);
        resultatRechercheConteneur.appendChild(arretActuelConteneur);

        const arretsResultatNom  = resultatsArrets[arret].nom;
        console.log(arretsResultatNom);

        const headerDialog = document.getElementById("title-header-dialog");
        const bodyDialog = document.getElementById("body-dialog-box");
        const titreDialogue = document.createElement("h2");

        arretActuelConteneur.addEventListener('click', () =>{

            bodyDialog.innerHTML = "";

            const titreArretHeader = resultatsArrets[arret].nom;
            console.log(titreArretHeader);

            const logosArretCopie = listeLigneArretActuel;
            console.log(logosArretCopie);

            listeLigneArretActuel.forEach(ligne => {

                // numéro de ligne de transport
                let numeroLigneActuelle = ligne;

                // En premier lieu on ajoute le conteneur d'élément
                const conteneurLigne = document.createElement("div");

                // on ajoute l'attribut qui lie la couleur au background du conteneur avec les éléments de la ligne
                conteneurLigne.setAttribute("class",`dialog-ligne ligne-${numeroLigneActuelle}`);


                // Ici je recréé le logo pour chaque ligne de l'arrêt
                const logoLigne = document.createElement("span");
                if(arretsTram.includes(ligne)){
                    logoLigne.setAttribute("class", `resultat-logo indicateur-ligne tramway ligne-${ligne}`);
                    logoLigne.innerHTML = "T"+ligne;
                }
                else if(arretsBusUrbain.includes(ligne)){
                    logoLigne.setAttribute("class", `resultat-logo indicateur-ligne busMTP ligne-${ligne}`);
                    logoLigne.innerHTML = ligne;
                }
                else {
                    logoLigne.setAttribute("class", `resultat-logo indicateur-ligne bus3M ligne-${ligne}`);
                    logoLigne.innerHTML = ligne;
                }

                const logoActuel = document.createElement("h1");
                logoActuel.setAttribute("class", "logo-ligne");
                logoActuel.appendChild(logoLigne);
                console.log("logo actuel :", logoActuel);

                // Ensuite on ajoute le logo de la ligne au conteneur d'élément
                conteneurLigne.appendChild(logoActuel);

                // On créée le conteneur avec le type de transport et le numéro de la ligne
                const descriptionLigneActuelle = document.createElement("div");
                descriptionLigneActuelle.setAttribute("class", "description-ligne-conteneur");

                const elementH1Transport = document.createElement('h1');
                const elementH2Nom = document.createElement('h2');

                // Création du type de transport utilisé
                const descriptionTransportLigne = document.createElement("span");
                descriptionTransportLigne.setAttribute("class", "description-transport-ligne");

                if (arretsTram.includes(numeroLigneActuelle)){
                    descriptionTransportLigne.textContent = "Tramway";
                }
                else {
                    descriptionTransportLigne.textContent = "Bus";
                }

                // Type de transport (h1 + span) ajouté au conteneur parent (descriptionLigneActuelle)
                elementH1Transport.appendChild(descriptionTransportLigne)
                descriptionLigneActuelle.appendChild(elementH1Transport);


                // Création du nom de la ligne utilisé
                const descriptionNomLigne = document.createElement("span");
                descriptionNomLigne.setAttribute("class", "description-nom-ligne");
                descriptionNomLigne.innerHTML = "Ligne "+ numeroLigneActuelle;
                
                // Ligne [numéro de ligne] ajouté au conteneur parent (descriptionLigneActuelle)
                elementH2Nom.appendChild(descriptionNomLigne);
                descriptionLigneActuelle.appendChild(elementH2Nom);

                // On ajoute le conteneur parent avec les 2 informations dans le conteneur élément
                conteneurLigne.appendChild(descriptionLigneActuelle);

                // ICI on ajoute les horaires (pas encore dynamique)
                const horairesConteneur = document.createElement("div");
                horairesConteneur.setAttribute("class", `horaire-ligne-conteneur ligne-${numeroLigneActuelle}`);

                // Horaire de la ligne terminus Aller
                const horaireAller = document.createElement("div");
                horaireAller.setAttribute("class", `horaire-ligne aller`);

                // Création de nom pour l'horaire aller
                const nomTerminusA = document.createElement("h3");

                nomTerminusA.innerHTML = "<span class='nom-terminus'>Odysseum</span>";


                // Création du timer aller
                const timerProchainPassageA = document.createElement("div");
                timerProchainPassageA.setAttribute("class", "timer-prochain-passage");

                timerProchainPassageA.innerHTML = "X min";

                //Ajout timer + nom dans le conteneur aller
                horaireAller.appendChild(nomTerminusA);
                horaireAller.appendChild(timerProchainPassageA);

                // Horaire de la ligne terminus retour
                const horaireRetour = document.createElement("div");
                horaireRetour.setAttribute("class", `horaire-ligne retour`);

                // Création de nom pour l'horaire retour
                const nomTerminusR = document.createElement("h3");

                nomTerminusR.innerHTML = "<span class='nom-terminus'>Mosson</span>";


                // Création du timer retour
                const timerProchainPassageR = document.createElement("div");
                timerProchainPassageR.setAttribute("class", "timer-prochain-passage");

                timerProchainPassageR.innerHTML = "X min";

                //Ajout timer + nom dans le conteneur retour
                horaireRetour.appendChild(nomTerminusR);
                horaireRetour.appendChild(timerProchainPassageR);

                // Ajout aller + retour dans horaire conteneur
                horairesConteneur.appendChild(horaireAller);
                horairesConteneur.appendChild(horaireRetour);

                // Ajout dans le conteneur avec tous les éléments
                conteneurLigne.appendChild(horairesConteneur);


                // création de la flèche
                const conteneurFleche = document.createElement("div");
                conteneurFleche.setAttribute("class","bouton-redirection");
                const fleche = document.createElement("i");
                fleche.setAttribute("class", "fa-solid fa-arrow-right");
                conteneurFleche.appendChild(fleche);

                conteneurLigne.appendChild(conteneurFleche);
                bodyDialog.appendChild(conteneurLigne);

                // Rediriger vers la page d'infos détaillées sur l'arrêt
                conteneurFleche.addEventListener('click', () => {

                    // TEMPORAIRE PCK LE CODE EST A RETRAVAILLER
                    const idArret = resultatsArrets[arret].id;

                    // fermer la boite de dialogue et charger la page
                    console.log(numeroLigneActuelle, idArret);
                    fermerDialogue("ligneInfo");
                    coordinateur.chargerPage('arret-details/' + numeroLigneActuelle + '/' + idArret);

                });

            });

            titreDialogue.setAttribute("class", "second-title");

            // et à l'intérieur j'écris le nom de l'ârret
            titreDialogue.innerHTML = titreArretHeader;

            // et je l'ajoute enfin à la page EJS
            headerDialog.appendChild(titreDialogue);

            // j'ouvre la pop-up
            ouvrirDialogue("ligneInfo");

            
        })
        
    });

    const barreRechercheArret = document.getElementById('recherche');
    const resultRecherche = document.getElementsByClassName('resultat-recherche');
    const aucunResultat = resultRecherche[resultRecherche.length-1];

    barreRechercheArret.addEventListener("keyup", (e) => {


        /* Barre de recherche active (première lettre relâché) */
        if(!barreRechercheArret.classList.contains("recherche-active") && barreRechercheArret.value.length > 0) {

            barreRechercheArret.classList.remove("recherche-inactive");
            barreRechercheArret.classList.add("recherche-active");

        }
        
        /* Barre de recherche inactive (plus de lettre dans la barre de recherche) */
        if(barreRechercheArret.value.length < 1) {

            barreRechercheArret.classList.remove("recherche-active");
            barreRechercheArret.classList.add("recherche-inactive");

            /* si la barre de recherche est inactive on cache tous les resultats */
            for(i = 0 ; i < resultRecherche.length ; i++){

                resultRecherche[i].classList.add("hidden");
            
            }
        
        /* Sinon (barre de recherche active + comparaison avec résultat) */
        } else {

            /* Booléen pour savoir si on a trouvé au moins 1 résultat pour notre recherche */
            let resultatTrouve = false;

            for(i = 0; i <resultRecherche.length ; i ++){

                const contenu = resultRecherche[i].textContent;

                /* Condition pour la comparaison entre notre recherche (barreRechercheArret) et tout les arrêts (resultRecherche) */
                if(contenu.toUpperCase().includes(barreRechercheArret.value.toUpperCase()) && contenu != "Aucun résultat trouvé") {
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

})();
