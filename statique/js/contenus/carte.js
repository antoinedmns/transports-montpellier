var map = L.map('map').setView([43.6112422, 3.8767337], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/yolatengo/clvo1mwvf01mr01qub500b9wd/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoieW9sYXRlbmdvIiwiYSI6ImNsdm8xcTNoeDA0cXIycW83aDg5aG1jajUifQ.TiT6N0IKT3817FeULBlHxA', {
    maxZoom: 19,
}).addTo(map);


//var tramIcon = L.divIcon({className: 'fa-solid fa-train-tram fa-lg'});
//var busIcon = L.divIcon({className: 'fa-solid fa-bus-simple fa-lg'});
//var marker = L.marker([43.6112422, 3.8767337],{icon: busIcon}).addTo(map);
//marker.bindPopup('<div class="bandeau-popup"><p>Place de l\'Europe</p></div><span class="indicateur-ligne tramway ligne-1">T1</span>');

(async () => {

    const layerTram = L.layerGroup();
    const layerBus = L.layerGroup();
    const layerMarkers = L.layerGroup(); // Ajout du layer pour les marqueurs

    const resultatTraces = await coordinateur.api.getAPI('api/traces-reseau');
    const resultatArrets = await coordinateur.api.getAPI('/api/arrets/reseau');
    const arretIcon = L.divIcon({ className: 'fa-solid fa-location-dot' });

    if (resultatTraces === undefined || resultatArrets === undefined) { 
        ouvrirDialogue("erreurCoord");
        return; // Quitte la fonction si une erreur est survenue
    }

    function enleverDoublons(liste) {
        return [...new Set(liste)];
    }

    // Création des couches pour les lignes de tram et de bus
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

    // Ajout des marqueurs d'arrêt au layerMarkers
    const coordArrets = Object.values(resultatArrets);
    for (const arret of coordArrets) {
        console.log(enleverDoublons(arret.lignes));
        let coordsInverse = [arret.coords[1], arret.coords[0]];
        let pointArret = L.marker(coordsInverse, { icon: arretIcon }).addTo(layerMarkers);
        pointArret.bindPopup('<div class="bandeau-popup"><p>'+arret.nom+' '+'</p></div></span><div class="liste-lignes"><h4 class="indicateur-ligne tramway ligne-4">'+enleverDoublons(arret.lignes)+'</h4></div>');
    }

    // Contrôle de l'affichage des couches en fonction du niveau de zoom
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

    // Ajout des couches au map
    layerTram.addTo(map);
    layerBus.addTo(map);
    layerMarkers.addTo(map);

})();
