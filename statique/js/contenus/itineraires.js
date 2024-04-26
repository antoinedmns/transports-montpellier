var map = L.map('map').setView([43.6112422, 3.8767337], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

map.addEventListener("click", (e) => console.log(e.latlng))

var latlngs = [
    [43.6160663084847, 3.81995767333402],
    [43.6168077761118, 3.81959795202173],
    [43.6168691815976, 3.81956910466489]
];

var polyline = L.polyline(latlngs, { color: '#005CA9', dashArray: "6 1 0" }).addTo(map);

(async () => {

    const resultatTraces = await coordinateur.api.getAPI('api/traces-reseau/');
    if (resultatTraces === undefined) {ouvrirDialogue("erreurCoord")}

})();

// zoom the map to the polyline
map.fitBounds(polyline.getBounds());

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

coordinateur.api.recupererCache('bouton-valider').addEventListener('click', async () => {
    console.log("click")
    const adrDebut = coordinateur.api.recupererCache('boite-debut').value;
    const adrFin = coordinateur.api.recupererCache('boite-fin').value;

    const resultat = await coordinateur.api.postAPI('api/hhhhhhhhhh',{debut: adrDebut, fin: adrFin});
    if (true) {ouvrirDialogue("erreurCoord");}   
});
