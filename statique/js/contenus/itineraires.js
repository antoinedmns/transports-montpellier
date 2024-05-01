var map = L.map('map').setView([43.6112422, 3.8767337], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/yolatengo/clvo1mwvf01mr01qub500b9wd/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoieW9sYXRlbmdvIiwiYSI6ImNsdm8xcTNoeDA0cXIycW83aDg5aG1jajUifQ.TiT6N0IKT3817FeULBlHxA', {
    maxZoom: 19,
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
                layerTram.addLayer(L.polyline(trajet, { color: ligne.couleur,weight: 4}));
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

function echangerTexte() {
    const flecheConteneur = document.querySelector('.fleche-conteneur');
    flecheConteneur.classList.add('spin-effect');

    setTimeout(function () {
        const boiteDebut = document.querySelector('.boite-debut');
        const boiteFin = document.querySelector('.boite-fin');

        const temp = boiteDebut.value;
        boiteDebut.value = boiteFin.value;
        boiteFin.value = temp;

        setTimeout(function () {
            flecheConteneur.classList.remove('spin-effect');
        }, 250);

    }, 125);
}


map.addEventListener("click", (e) => {
    if (document.getElementById("boite-debut").value == "") {
        document.getElementById("boite-debut").value = e.latlng.lat + " " + e.latlng.lng;
    }
    else {
        document.getElementById("boite-fin").value = e.latlng.lat + " " + e.latlng.lng;
    }
})

var boutonValider = document.getElementById('bouton-valider');

if(boutonValider) {
    boutonValider.addEventListener('click', async () => {
        const elmDebut = document.getElementById('boite-debut');
        const elmFin = document.getElementById('boite-fin');
        const icoLoupe = document.getElementById('loupe');
        const icoPan = document.getElementById('panneaux');

        if (elmDebut.value.trim() === '' || elmFin.value.trim() === '') {
            ouvrirDialogue("erreurCoord");
            return;
        }

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
}
