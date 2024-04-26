var map = L.map('map').setView([43.6112422, 3.8767337], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


var tramIcon = L.divIcon({className: 'fa-solid fa-train-tram fa-lg'});
var busIcon = L.divIcon({className: 'fa-solid fa-bus-simple fa-lg'});
var marker = L.marker([43.6112422, 3.8767337],{icon: busIcon}).addTo(map);
marker.bindPopup('<div class="bandeau-popup"><p>Place de l\'Europe</p></div><span class="indicateur-ligne tramway ligne-1">T1</span>');


(async () => {

    const resultatTraces = await coordinateur.api.getAPI('api/traces-reseau/');
    if (resultatTraces === undefined) {ouvrirDialogue("erreurCoord")}
    console.log(resultatTraces);
    for(const ligne of resultatTraces) {
        console.log(ligne)
        for(const trajet of ligne.coordonnees) {
            console.log(trajet)
            L.polyline(trajet, { color: ligne.couleur}).addTo(map);
        }
    }
})();