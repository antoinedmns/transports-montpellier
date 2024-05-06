var ligneActuelle = null;

function afficherArretDetails(ligneId, arretId) {

    ligneActuelle = ligneId;

    coordinateur.api.getAPI('api/ligne/' + ligneId + '/arret/' + arretId + '/infos').then((infos) => {

        /**
         * Structure de la donnée reçue :
         * {
         *   ligne: {
         *      couleur: '#...'
         *   },
         *   arret: {
         *      nom: 'Occitanie',
         *      commune: 'Montpellier',
         *      coordonnees: [<latitude>, <longitude>],
         *      lignes: ['6', '1'],
         *      directions: ['Odysseum', 'Mosson'],
         *   }
         * }
         */

        // Moyenne RGB de la couleur de la ligne
        // Utilisé pour déterminer si le texte doit être blanc ou noir quand superposé à la couleur de la ligne
        const rgb = (infos.ligne.couleur.match(/[A-Za-z0-9]{2}/g) ?? ['00', '00', '00']).map(e => parseInt(e, 16));
        const moyenne = (rgb[0] + rgb[1] + rgb[2]) / 3;
        const estCouleurNeutre = moyenne > 128;

        // En-tête
        coordinateur.api.recupererCache('enteteTitre').innerHTML = 'Ligne ' + ligneId;
        coordinateur.api.recupererCache('enteteSoustitre').innerHTML = infos.arret.nom;

        const indicateur = coordinateur.api.recupererCache('enteteIndicateurLigne');
        const typeReseau = infoLignes.tram.includes(ligneId.toString()) ? 'tramway' : infoLignes.urbain.includes(ligneId.toString()) ? 'busMTP' : 'bus3M';
        
        indicateur.className = '';
        indicateur.classList.add(typeReseau, 'ligne-' + ligneId, 'indicateur-ligne');
        indicateur.innerText = ligneId;

        // Mettre l'en-tête à la couleur de la ligne
        coordinateur.api.recupererCache('enteteArret').style.backgroundColor = infos.ligne.couleur;
        if (estCouleurNeutre) {

            coordinateur.api.recupererCache('enteteTitre').style.color = 'rgba(38, 38, 38, 0.82)';
            coordinateur.api.recupererCache('enteteSoustitre').style.color = '#262626';
            coordinateur.api.recupererCache('enteteIndicateurLigne').style.color = '#262626';
            coordinateur.api.recupererCache('enteteIndicateurLigne').style.border = '4px solid rgba(38, 38, 38, 0.82)';

        } else {

            // Réinitialiser les couleurs
            coordinateur.api.recupererCache('enteteTitre').style.color = '';
            coordinateur.api.recupererCache('enteteSoustitre').style.color = '';
            coordinateur.api.recupererCache('enteteIndicateurLigne').style = '';

        }

        const listeIntervalles = [];

        // Afficher la liste des autres lignes passant par l'arrêt
        if (infos.arret.lignes.length > 1) {
        
            // (au cas où la section ait été précédemment cachée)
            coordinateur.api.recupererCache('autresLignes').style.display = 'block';

            // Créer la liste des autres lignes
            const listeLignes = coordinateur.api.recupererCache('listeAutresLignes');
            listeLignes.innerHTML = '';

            for (const ligne of infos.arret.lignes) {

                // Créer un élément de liste
                const element = document.createElement('span');
                const typeReseauLigne = infoLignes.tram.includes(ligne) ? 'tramway' : infoLignes.urbain.includes(ligne) ? 'busMTP' : 'bus3M';
                
                element.classList.add('indicateur-ligne', typeReseauLigne, 'ligne-' + ligne);
                element.innerText = ligne;

                if (ligne === ligneId.toString()) {

                    element.classList.add('ligne-active');

                } else {

                    element.addEventListener('click', () => {

                        // supprimer toutes les intervalles de rafraichissement
                        console.log('suppression de ', listeIntervalles.length, ' intervalles de rafraichissement...');
                        (() => {
                            listeIntervalles.forEach(clearInterval);
                            afficherArretDetails(ligne, arretId);
                        })();

                    });

                }

                // Ajouter l'élément au texte
                listeLignes.appendChild(element);

            }
        
        } else {

            // Il n'y a pas d'autres lignes, cacher la section
            coordinateur.api.recupererCache('autresLignes').style.display = 'none';

        }

        // Afficher les directions
        [
            coordinateur.api.recupererCache('versDestination0'),
            coordinateur.api.recupererCache('versDestination1'),

        ].forEach((element, index) => {
            element.innerHTML = infos.arret.directions[index] ?? 'Inconnu';
        });

        const afficherHorraires = () => {

            coordinateur.api.getAPI('api/ligne/' + ligneId + '/arret/' + arretId + '/passages').then((passages) => {

                // Horaires
                for (const containeurHorraireId of [0, 1]) {

                    const containeurHorraire = coordinateur.api.recupererCache('horairesTempsReel' + containeurHorraireId);
                    containeurHorraire.innerHTML = '';

                    // Préparer les prochains passages (éliminer les passages déjà passés, et trier par ordre croissant)
                    let passageHorraire = passages[containeurHorraireId] ?? [];
                    passageHorraire = passageHorraire.filter(passage => passage.time * 1000 > Date.now()).sort((a, b) => a.time - b.time).slice(0, 7);

                    for (let i = 0; i < passageHorraire.length; i++) {

                        const passage = passageHorraire[i];

                        // Créer un élément de passage
                        const element = document.createElement('div');
                        element.classList.add('passage');

                        if (i === 0) {
                            element.style.backgroundColor = infos.ligne.couleur;
                            element.style.color = estCouleurNeutre ? 'rgba(38, 38, 38, 0.9)' : '#fff';
                        }

                        // Créer un élément de direction
                        const direction = document.createElement('h2');
                        direction.classList.add('direction');
                        direction.innerText = passage.headsign;

                        // Créer un élément de temps
                        const temps = document.createElement('h2');
                        temps.classList.add('temps');
                        
                        const passeDansSecondes = Math.round(((passage.time * 1000) - Date.now()) / 1000);
                        temps.innerText = passeDansSecondes > 90 ? Math.floor(passeDansSecondes / 60) + ' min' : passeDansSecondes + 's';

                        listeIntervalles.push(setInterval(
                            () => {
                                if (!temps) return;
                                const tempsRestant = Math.round(((passage.time * 1000) - Date.now()) / 1000);
                                temps.innerText = tempsRestant <= 0 ? 'A quai' : tempsRestant > 90 ? Math.floor(tempsRestant / 60) + ' min' : tempsRestant + 's';
                            }, passeDansSecondes > 150 ? 10000 : 1000)
                        )

                        // Ajouter les éléments au passage
                        element.appendChild(direction);
                        element.appendChild(temps);

                        // Ajouter le passage au conteneur
                        containeurHorraire.appendChild(element);

                    }

                }

            });

            // Actualier les horaires toutes les 30 secondes
            listeIntervalles.push(setInterval(() => {

                console.log(ligneId, ligneActuelle, coordinateur.pageActuelle.startsWith('arret-details'));

                // si l'utilisateur a changé de page, arrêter le rafraichissement ('arret-details/<ligne>/<arret>')
                if (!coordinateur.pageActuelle.startsWith('arret-details') || ligneActuelle !== ligneId) {
                    console.log('page quittée. réinitialisation des intervalles de rafraichissement...', coordinateur.pageActuelle, 'arret-details/' + ligneId + '/' + arretId);
                    return;
                } else {
                    listeIntervalles.forEach(clearInterval);
                    afficherHorraires();
                    console.log('rafraichissement des horaires en cours...')
                }
            
            }, 30000));

        };

        afficherHorraires();

        // Thermomètre
        [
            coordinateur.api.recupererCache('thermometreDirection0'),
            coordinateur.api.recupererCache('thermometreDirection1')
        ].forEach((thermometreDirection, index) => {
            thermometreDirection.innerHTML = infos.arret.directions[index] ?? 'Inconnu';
            thermometreDirection.style.color = infos.ligne.couleur;
        });

        // Ligne du thermomètre
        coordinateur.api.recupererCache('thermometreLigne').style.backgroundColor = infos.ligne.couleur;

    }).catch((err) => {

        // TODO: gerer l'erreur
        console.error(err);

    });

}

afficherArretDetails(ligneId, arretId);