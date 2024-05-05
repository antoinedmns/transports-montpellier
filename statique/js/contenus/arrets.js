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


        if ( resultatsArrets[arret].lignes.length === 0){
            arretActuelConteneur.setAttribute("class", "resultat-recherche null");
        }
    
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


        const headerDialog = document.getElementById("title-header-dialog");
        const bodyDialog = document.getElementById("body-dialog-box");
        const titreDialogue = document.createElement("h2");

        arretActuelConteneur.addEventListener('click', () =>{

            
            // Je supprime le contenu body de la pop up précédente
            bodyDialog.innerHTML = "";

            // Je supprime le contenu header de la pop up précédente
            headerDialog.innerHTML = "";

            // J'ajoute le premier et le second titre au header
            const titreArretHeader = resultatsArrets[arret].nom;
            const titreStaticHeader = document.createElement("h1");

            titreStaticHeader.setAttribute('class', 'first-title');
            titreDialogue.setAttribute("class", "second-title");

            // et à l'intérieur j'écris le "choisir une ligne" suivi du nom de l'arret
            titreStaticHeader.innerHTML = "Choisir une ligne";
            titreDialogue.innerHTML = titreArretHeader;

            // et je l'ajoute enfin à la page EJS
            if (!headerDialog.querySelector(".second-title")) {
                headerDialog.appendChild(titreStaticHeader);
                headerDialog.appendChild(titreDialogue);
            }

            coordinateur.api.getAPI('api/arret/' + resultatsArrets[arret].id + '/lignes').then((infos) => {for (ligne of infos){

                const rgb = (ligne.couleur.match(/[A-Za-z0-9]{2}/g) ?? ['00', '00', '00']).map(e => parseInt(e, 16));
                const moyenne = (rgb[0] + rgb[1] + rgb[2]) / 3;
                const estCouleurNeutre = moyenne > 150;

                // numéro de ligne de transport
                let numeroLigneActuelle = ligne.numero;
                let direction = ligne.directions;

                // En premier lieu on ajoute le conteneur d'élément
                const conteneurLigne = document.createElement("div");

                const sousConteneurLigneGauche = document.createElement("div");
                const sousConteneurLigneDroit = document.createElement("div");

                sousConteneurLigneGauche.setAttribute("class", "sous-conteneur");
                sousConteneurLigneDroit.setAttribute("class", "sous-conteneur");

                // on ajoute l'attribut qui lie la couleur au background du conteneur avec les éléments de la ligne
                conteneurLigne.setAttribute("class",`dialog-ligne`);


                conteneurLigne.style.backgroundColor = 'rgba('+ rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + 0.8 + ')';

                // Ici je recréé le logo pour chaque ligne de l'arrêt
                const logoLigne = document.createElement("span");
                if(arretsTram.includes(numeroLigneActuelle)){
                    logoLigne.setAttribute("class", `resultat-logo indicateur-ligne tramway ligne-${numeroLigneActuelle}`);
                    logoLigne.innerHTML = "T"+numeroLigneActuelle;
                }
                else if(arretsBusUrbain.includes(numeroLigneActuelle)){
                    logoLigne.setAttribute("class", `resultat-logo indicateur-ligne busMTP ligne-${numeroLigneActuelle}`);
                    logoLigne.innerHTML = numeroLigneActuelle;
                }
                else {
                    logoLigne.setAttribute("class", `resultat-logo indicateur-ligne bus3M ligne-${numeroLigneActuelle}`);
                    logoLigne.innerHTML = numeroLigneActuelle;
                }

                const logoActuel = document.createElement("h1");
                logoActuel.setAttribute("class", "logo-ligne");
                logoActuel.appendChild(logoLigne);

                // Ensuite on ajoute le logo de la ligne au conteneur d'élément
                sousConteneurLigneGauche.appendChild(logoActuel);

                // On créée le conteneur avec le type de transport et le numéro de la ligne
                const descriptionLigneActuelle = document.createElement("div");
                descriptionLigneActuelle.setAttribute("class", "description-ligne-conteneur");

                const elementH1Transport = document.createElement('h1');
                const elementH2Nom = document.createElement('h2');

                if(estCouleurNeutre){
                    elementH1Transport.style.color = 'rgba(38, 38, 38, 0.82)';
                    elementH2Nom.style.color = '#262626';
                }
                else {
                    elementH1Transport.style.color = 'rgba(255, 255, 255, 0.8)';
                    elementH2Nom.style.color = '#ffffff';
                }

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
                sousConteneurLigneGauche.appendChild(descriptionLigneActuelle);
                conteneurLigne.appendChild(sousConteneurLigneGauche);

                // ICI on ajoute les horaires (pas encore dynamique)
                const horairesConteneur = document.createElement("div");
                horairesConteneur.setAttribute("class", `horaire-ligne-conteneur`);

                // Horaire de la ligne terminus Aller
                const horaireAller = document.createElement("div");
                horaireAller.setAttribute("class", `horaire-ligne aller`);

                if (ligne.prochains_passages[0]) {

                    // Création de nom pour l'horaire aller
                    const nomTerminusA = document.createElement("h3");

                    nomTerminusA.innerHTML = "<span class='nom-terminus'>"+ligne.prochains_passages[0].headsign+"</span>";

                    // Création du timer aller
                    const timerProchainPassageA = document.createElement("div");
                    timerProchainPassageA.setAttribute("class", "timer-prochain-passage");

                    const passageTempsSeconds = Math.floor((ligne.prochains_passages[0].timestamp - (Date.now() / 1000)));
                    timerProchainPassageA.innerHTML = ligne.prochains_passages[0].timestamp === 0 ? 'Aucun passage' : passageTempsSeconds > 90 ? Math.floor(passageTempsSeconds / 60) + " min" : passageTempsSeconds + " sec";

                    //Ajout timer + nom dans le conteneur aller
                    horaireAller.appendChild(nomTerminusA);
                    horaireAller.appendChild(timerProchainPassageA);

                }

                // Horaire de la ligne terminus retour
                const horaireRetour = document.createElement("div");
                horaireRetour.setAttribute("class", `horaire-ligne retour`);                

                if (ligne.prochains_passages[1]) {

                    // Création de nom pour l'horaire retour
                    const nomTerminusR = document.createElement("h3");

                    nomTerminusR.innerHTML = "<span class='nom-terminus'>"+ligne.prochains_passages[1].headsign+"</span>";

                    // Création du timer retour
                    const timerProchainPassageR = document.createElement("div");
                    timerProchainPassageR.setAttribute("class", "timer-prochain-passage");

                    const passageTempsSeconds = Math.floor((ligne.prochains_passages[1].timestamp - (Date.now() / 1000)));
                    timerProchainPassageR.innerHTML = ligne.prochains_passages[1].timestamp === 0 ? 'Aucun passage' : passageTempsSeconds > 90 ? Math.floor(passageTempsSeconds / 60) + " min" : passageTempsSeconds + " sec";

                    //Ajout timer + nom dans le conteneur retour
                    horaireRetour.appendChild(nomTerminusR);
                    horaireRetour.appendChild(timerProchainPassageR);

                }

                // Ajout aller + retour dans horaire conteneur
                horairesConteneur.appendChild(horaireAller);
                horairesConteneur.appendChild(horaireRetour);

                // Ajout dans le conteneur avec tous les éléments
                sousConteneurLigneDroit.appendChild(horairesConteneur);


                // création de la flèche
                const conteneurFleche = document.createElement("div");
                conteneurFleche.setAttribute("class","bouton-redirection");
                const fleche = document.createElement("i");
                fleche.setAttribute("class", "fa-solid fa-arrow-right");
                conteneurFleche.appendChild(fleche);

                sousConteneurLigneDroit.appendChild(conteneurFleche);

                conteneurLigne.appendChild(sousConteneurLigneGauche);
                conteneurLigne.appendChild(sousConteneurLigneDroit);

                bodyDialog.appendChild(conteneurLigne);

                // Rediriger vers la page d'infos détaillées sur l'arrêt
                conteneurFleche.addEventListener('click', () => {

                    // TEMPORAIRE PCK LE CODE EST A RETRAVAILLER
                    const idArret = resultatsArrets[arret].id;

                    // fermer la boite de dialogue et charger la page
                    fermerDialogue("ligneInfo");
                    coordinateur.chargerPage('arret-details/' + numeroLigneActuelle + '/' + idArret);

                });

            }});

            // j'ouvre la pop-up
            ouvrirDialogue("ligneInfo");

        });
        
    });

    const barreRechercheArret = document.getElementById('recherche');
    const resultRecherche = document.getElementsByClassName('resultat-recherche');
    const aucunResultat = resultRecherche[0];

    barreRechercheArret.addEventListener("keyup", () => {


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