document.getElementById('leafletScript').addEventListener('load', async () => {

    const map = L.map('map').setView([43.6112422, 3.8767337], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/yolatengo/clvo1mwvf01mr01qub500b9wd/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoieW9sYXRlbmdvIiwiYSI6ImNsdm8xcTNoeDA0cXIycW83aDg5aG1jajUifQ.TiT6N0IKT3817FeULBlHxA', {
        maxZoom: 19,
    }).addTo(map);

    const layerTram = L.layerGroup(); // Layer pour les tramways
    const layerBus = L.layerGroup(); // Layer pour les bus
    const layerMarkers = L.layerGroup(); // Layer pour les arrêts

    const resultatTraces = await coordinateur.api.getAPI('api/traces-reseau');
    const resultatArrets = await coordinateur.api.getAPI('/api/arrets/reseau');

    const arretIcon = L.divIcon({ className: 'fa-solid fa-location-dot' });

    if (resultatTraces === undefined || resultatArrets === undefined) { 
        ouvrirDialogue("erreurCoord");
    } else {
        for (let i = resultatTraces.length - 1; i >= 0; i--) {
            const ligne = resultatTraces[i];
            for (const trajet of ligne.coordonnees) {
                if (ligne.num >= 5) {
                    layerBus.addLayer(L.polyline(trajet, { color: ligne.couleur, opacity: 0.5 }));
                } else {
                    layerTram.addLayer(L.polyline(trajet, { color: ligne.couleur, weight: 4 }));
                }
            }
        }
    }
        
    const coordArrets = Object.values(resultatArrets);
    for (const arret of coordArrets) {
        let coordsInverse = [arret.coords[1], arret.coords[0]];
        let pointArret = L.marker(coordsInverse, { icon: arretIcon, title: arret.nom }).addTo(layerMarkers);
        pointArret.bindPopup(arret.nom.toString());
    }

    map.on('popupopen', async function(e) {

        const popupNode = e.popup.getElement().querySelector('.leaflet-popup-content');
        const arretInfo = resultatArrets[popupNode.innerText];
        const resultatTerminus = await coordinateur.api.getAPI('api/arret/'+arretInfo.id+'/lignes');

        console.log(resultatTerminus);

        // Création du wrapper du contenu de la popup Leaflet
        const leafletPopupContentWrapper = document.createElement("div");
        leafletPopupContentWrapper.classList.add("leaflet-popup-content");

        // Création du conteneur du bandeau
        const containerBandeau = document.createElement("div");
        containerBandeau.classList.add("container-bandeau");

        // Création du bandeau
        const bandeauPopup = document.createElement("div");
        bandeauPopup.classList.add("bandeau-popup");
        bandeauPopup.innerHTML = arretInfo.nom;

        // Création de la liste des lignes
        const listeLignes = document.createElement("div");
        listeLignes.classList.add("liste-lignes");

        containerBandeau.appendChild(bandeauPopup);
        leafletPopupContentWrapper.appendChild(containerBandeau);
        leafletPopupContentWrapper.appendChild(listeLignes);

        // Ajout des éléments pour chaque résultat de terminus
        let i = 0;
        for (const ligne of arretInfo.lignes) {
            const rgb = (resultatTerminus[i].couleur.match(/[A-Za-z0-9]{2}/g) ?? ['00', '00', '00']).map(e => parseInt(e, 16));
            const moyenne = (rgb[0] + rgb[1] + rgb[2]) / 3;
            const estCouleurNeutre = moyenne > 128;
            let ligneTexte = ligne;
            let classeLigne = '';
            if (infoLignes.tram.includes(ligne)) {
                classeLigne = 'tramway';
                ligneTexte = 'T' + ligne;
            } else if (infoLignes.urbain.includes(ligne)) {
                classeLigne = 'busMTP';
            } else {
                classeLigne = 'bus3M';
            }

            // Création des éléments HTML
            const ligneAffichage = document.createElement("div");
            ligneAffichage.classList.add("ligne-affichage");
            ligneAffichage.style.backgroundColor = resultatTerminus[i].couleur + "4A";

            const indicateurLigne = document.createElement("h1");
            indicateurLigne.classList.add('indicateur-ligne', classeLigne, 'ligne-' + ligne);
            indicateurLigne.innerHTML = ligneTexte;

            const indicateurTempsConteneur = document.createElement("div");
            indicateurTempsConteneur.classList.add("indicateur-temps-conteneur");

            /* 
            const terminusAller = document.createElement("p");
            terminusAller.classList.add("terminus-aller");
            terminusAller.innerHTML = resultatTerminus[i].directions[1];

            const indicateurTempsBoiteAller = document.createElement("div");
            indicateurTempsBoiteAller.classList.add("indicateur-temps-boite-aller");
            indicateurTempsBoiteAller.style.color = resultatTerminus[i].couleur;
            indicateurTempsBoiteAller.innerHTML = "2min";

            const terminusRetour = document.createElement("p");
            terminusRetour.classList.add("terminus-retour");
            terminusRetour.innerHTML = resultatTerminus[i].directions[0];

            const indicateurTempsBoiteRetour = document.createElement("div");
            indicateurTempsBoiteRetour.classList.add("indicateur-temps-boite-retour");
            indicateurTempsBoiteRetour.style.color = resultatTerminus[i].couleur;
            indicateurTempsBoiteRetour.innerHTML = "1min"; */

            console.log(resultatTerminus[i]);

            const directionPassagesBrut = Object.values(resultatTerminus[i].prochains_passages);
            const directionPassages = (directionPassagesBrut.length >= 1
                ? directionPassagesBrut : [null, null])

            for (const directionPassage of directionPassages) {

                const passageElement = document.createElement("div");
                passageElement.classList.add("passage-element");

                const terminus = document.createElement("p");
                terminus.classList.add("terminus");
                terminus.innerHTML = directionPassage ? directionPassage.headsign : "Service";

                const temps = document.createElement("p");
                temps.classList.add("temps");

                if (directionPassage) {
                    const passageDansSecondes = parseInt(directionPassage.timestamp) - Math.floor(Date.now() / 1000);
                    temps.innerHTML = passageDansSecondes <= 5 ? "A quai"
                        : passageDansSecondes < 90 ? passageDansSecondes + "s"
                        : Math.floor(passageDansSecondes / 60) + " min";
                } else temps.innerHTML = "Terminé";

                passageElement.appendChild(terminus);
                passageElement.appendChild(temps);
                indicateurTempsConteneur.appendChild(passageElement);

            }

            // Ajout des éléments créés à leurs parents respectifs
            ligneAffichage.appendChild(indicateurLigne);
            ligneAffichage.appendChild(indicateurTempsConteneur);
            listeLignes.appendChild(ligneAffichage);

            // Écouteur d'événement click sur chaque ligne
            ligneAffichage.addEventListener('click', () => {
                // fermer la boite de dialogue et charger la page
                coordinateur.chargerPage('arret-details/' + ligne + '/' + arretInfo.id);
            });

            i += 1;
        }

        popupNode.innerHTML = ''; // Effacer le contenu précédent
        popupNode.appendChild(leafletPopupContentWrapper);
    
    });

    // Contrôle de l'affichage des layers en fonction du niveau de zoom
    map.on('zoomend', recalibrerZoom);

    /**
     * Recalibrer le zoom (affichage des layers en fonction du niveau de zoom)
     */
    function recalibrerZoom() {

        const currentZoom = map.getZoom();
        if (currentZoom >= 12) {

            const layerOpacite = Math.min(1, (currentZoom - 11.5) / 7);
            console.log(currentZoom);
            layerBus.eachLayer(function (layer) {
                layer.setStyle({ opacity: layerOpacite });
            });

            if (!map.hasLayer(layerBus)) map.addLayer(layerBus);
            if (currentZoom >= 14 && !map.hasLayer(layerMarkers)) map.addLayer(layerMarkers);
            else if (currentZoom < 14 && map.hasLayer(layerMarkers)) map.removeLayer(layerMarkers);

        } else {

            if (map.hasLayer(layerBus)) map.removeLayer(layerBus);
            if (map.hasLayer(layerMarkers)) map.removeLayer(layerMarkers);
            if (!map.hasLayer(layerTram)) map.addLayer(layerTram);
            
        }

    }

    layerTram.addTo(map);
    layerBus.addTo(map);
    layerMarkers.addTo(map);

    // Calibrer le zoom initial
    recalibrerZoom();

});
