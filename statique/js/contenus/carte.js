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
    const resultatTraces = await coordinateur.api.getAPI('api/traces-reseau/');

    if (resultatTraces === undefined) { ouvrirDialogue("erreurCoord") };

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

    map.on('zoomend', function () {
        console.log(map.getZoom())
        if (map.getZoom() >= 14 && !map.hasLayer(layerBus)) {
            map.addLayer(layerBus);
        }
        if (map.getZoom() < 14 && map.hasLayer(layerBus)) {
            map.removeLayer(layerBus);
        }
    });

    layerTram.addTo(map);
    layerBus.addTo(map);

})();

(async () => {

    const resultatArrets = await coordinateur.api.getAPI('/api/arrets/reseau');
    var arretIcon = L.divIcon({ className: 'fa-solid fa-location-dot'});

    if (resultatArrets == undefined) { ouvrirDialogue("erreurCoord") };

    const coordArrets = Object.values(resultatArrets);

    console.log(coordArrets);

    for (const arrets of coordArrets) {
        console.log(arrets.coords);
        let coordsInverse = [arrets.coords[1], arrets.coords[0]];
        let pointArret = L.marker(coordsInverse, { icon: arretIcon }).addTo(map);
        pointArret.bindPopup('<div class="bandeau-popup"><p>'+arrets.nom+'</p></div></span>');
    }
    
})();