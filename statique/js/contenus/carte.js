// Attendre le chargement du CDN de Leaflet avant de charger la carte
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
    }

    for (let i = resultatTraces.length - 1; i >= 0; i--) {

        const ligne = resultatTraces[i];
        
        for (const trajet of ligne.coordonnees) {
            if (ligne.num >= 5) {
                layerBus.addLayer(L.polyline(trajet, { color: ligne.couleur, opacity: 0.5 }));
            }
            else {
                layerTram.addLayer(L.polyline(trajet, { color: ligne.couleur, weight: 4 }));
            }
        }

    }
        
    const coordArrets = Object.values(resultatArrets);
    for (const arret of coordArrets) {

        const lignesUniques = [...new Set(arret.lignes)]; // On enlève les doublons

        let coordsInverse = [arret.coords[1], arret.coords[0]];
        let pointArret = L.marker(coordsInverse, { icon: arretIcon }).addTo(layerMarkers);
        let popupContent = '<div class="bandeau-popup"><p>'+arret.nom+' '+'</p></div></span>';
    
        // NOTE HUGO: ça serrait pas mieux de créer le popup en temps réel, quand l'utilisateur clique sur le marqueur ?
        // pck mettre en cache du HTML pré-construit de 230 arrets ça me parait un peu lourd

        // Ajout de chaque ligne dans sa propre div pour les afficher en ligne
        popupContent += '<div class="liste-lignes">'; // Ajout d'une div pour contenir toutes les lignes

        for (const ligne of lignesUniques) {
            let classeLigne = ''; // Classe par défaut (si il y a une erreur rien ne s'affiche)

            if (infoLignes.tram.includes(ligne)) classeLigne = 'tramway';
            else if (infoLignes.urbain.includes(ligne)) classeLigne = 'busMTP';
            else classeLigne = 'bus3M';

            popupContent += '<h2 class="indicateur-ligne ' + classeLigne + ' ligne-' + ligne + '">' + ligne + '</h2>';
        }

        popupContent += '</div>'; // Fermeture de la div contenant toutes les lignes
        popupContent += '<div class="info-lignes"><u>Informations →</u></div>'
        
        pointArret.bindPopup(popupContent);

    }    
    
    // Contrôle de l'affichage des layers en fonction du niveau de zoom
    map.on('zoomend', function () {
        const currentZoom = map.getZoom();
        if (currentZoom >= 14) {
            if (!map.hasLayer(layerBus)) map.addLayer(layerBus);
            if (!map.hasLayer(layerMarkers)) map.addLayer(layerMarkers);
        } else {
            if (map.hasLayer(layerBus)) map.removeLayer(layerBus);
            if (map.hasLayer(layerMarkers)) map.removeLayer(layerMarkers);
            if (!map.hasLayer(layerTram)) map.addLayer(layerTram);
        }
    });

    layerTram.addTo(map);
    layerBus.addTo(map);
    layerMarkers.addTo(map);

});
