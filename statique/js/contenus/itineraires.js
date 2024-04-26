var map = L.map('map').setView([43.6112422, 3.8767337], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

map.addEventListener("click", (e) => console.log(e.latlng));

(async () => {

    const layerTram = L.layerGroup();
    const layerBus = L.layerGroup();
    const resultatTraces = await coordinateur.api.getAPI('api/traces-reseau/');

    if (resultatTraces === undefined) {ouvrirDialogue("erreurCoord")}
    console.log(resultatTraces);

    for(let i=resultatTraces.length-1; i >= 0;i--) {
        const ligne = resultatTraces[i];
        console.log(ligne);
        for(const trajet of ligne.coordonnees) {
            console.log(trajet);
            if(ligne.num >= 5) {
                layerBus.addLayer(L.polyline(trajet, { color: ligne.couleur,opacity: 0.5}));
            }
            else {
                layerTram.addLayer(L.polyline(trajet, { color: ligne.couleur,weight: 5}));
            }
        }
    }

    map.on('zoomend',function() {
        console.log(map.getZoom())
        if(map.getZoom() >= 14 && !map.hasLayer(layerBus)) {
            map.addLayer(layerBus);
        }
        if(map.getZoom() < 14 && map.hasLayer(layerBus)) {
            map.removeLayer(layerBus);
        }
    });

    layerTram.addTo(map);
    layerBus.addTo(map);
    

})();

// dashArray: "6 1 0" 

function echangerTexte() {
    // Ajouter la classe pour l'effet de rotation
    const flecheConteneur = document.querySelector('.fleche-conteneur');
    flecheConteneur.classList.add('spin-effect');

    // Définir un délai avant d'échanger le texte
    setTimeout(function () {
        const boiteDebut = document.querySelector('.boite-debut');
        const boiteFin = document.querySelector('.boite-fin');

        // Échanger les valeurs
        const temp = boiteDebut.value;
        boiteDebut.value = boiteFin.value;
        boiteFin.value = temp;

        // Supprimer la classe après un certain délai pour permettre à l'animation de se terminer
        setTimeout(function () {
            flecheConteneur.classList.remove('spin-effect');
        }, 250); // Correspond à la durée de l'animation 

    }, 125); // Délai en millisecondes avant l'échange de texte 
}


map.addEventListener("click", (e) => {
    if (document.getElementById("boite-debut").value == "") {
        document.getElementById("boite-debut").value = e.latlng.lat + " " + e.latlng.lng;
    }
    else {
        document.getElementById("boite-fin").value = e.latlng.lat + " " + e.latlng.lng;
    }
})

var boutonValider = coordinateur.api.recupererCache('bouton-valider');

if(boutonValider) boutonValider.addEventListener('click', async () => {
    const elmDebut = coordinateur.api.recupererCache('boite-debut');
    const elmFin = coordinateur.api.recupererCache('boite-fin');
    const icoLoupe = coordinateur.api.recupererCache('loupe');
    const icoPan = coordinateur.api.recupererCache('panneaux');
    elmDebut.disabled = true;
    elmFin.disabled = true;

    icoLoupe.style.display = "none";
    icoPan.style.display = "inline-block";

    const adrDebut = elmDebut.value;
    const adrFin = elmFin.value;

    const resultat = await coordinateur.api.postAPI('api/hhhhhhhhhh',{debut: adrDebut, fin: adrFin});
    elmDebut.disabled = false;
    elmFin.disabled = false;
    icoLoupe.style.display = "inline-block";
    icoPan.style.display = "none";
    if (true) {ouvrirDialogue("erreurCoord");}   
});