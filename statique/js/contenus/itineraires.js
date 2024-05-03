var map = L.map('map').setView([43.6112422, 3.8767337], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/yolatengo/clvo1mwvf01mr01qub500b9wd/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoieW9sYXRlbmdvIiwiYSI6ImNsdm8xcTNoeDA0cXIycW83aDg5aG1jajUifQ.TiT6N0IKT3817FeULBlHxA', {
    maxZoom: 19,
}).addTo(map);

map.addEventListener("click", (e) => console.log(e.latlng));

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
var routingControl = null;

function addRoutingControl(debutCoords, finCoords) {
    if (routingControl !== null) {
        map.removeControl(routingControl);
    }

    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(debutCoords[0], debutCoords[1]), 
            L.latLng(finCoords[0], finCoords[1])
        ],
        lineOptions: {
            styles: [
                {color : "rgb(17, 73, 159)"}
            ]
        }
    }).addTo(map);
}

function clearMap() {

    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker || layer instanceof L.LayerGroup) {
            map.removeLayer(layer);
        }
    });

    map.eachLayer(function(layer) {
        if (layer instanceof L.Routing.Control) {
            map.removeControl(layer);
        }
    });

}

if (boutonValider) {

    boutonValider.addEventListener('click', async () => {
        const elmDebut = document.getElementById('boite-debut');
        const elmFin = document.getElementById('boite-fin');
        const icoLoupe = document.getElementById('loupe');
        const icoPan = document.getElementById('panneaux');

        if (elmDebut.value.trim() === '' || elmFin.value.trim() === '') {
            ouvrirDialogue("erreurCoord");
            return;
        }

        clearMap();

        elmDebut.disabled = true;
        elmFin.disabled = true;
        icoLoupe.style.display = "none";
        icoPan.style.display = "inline-block";

        const debutCoords = elmDebut.value.split(' ').map(coord => parseFloat(coord));
        const finCoords = elmFin.value.split(' ').map(coord => parseFloat(coord));

        addRoutingControl(debutCoords, finCoords);

        elmDebut.disabled = false;
        elmFin.disabled = false;
        icoLoupe.style.display = "inline-block";
        icoPan.style.display = "none";

        elmDebut.value = "";
        elmFin.value = "";

    });
}
