var map = L.map('map').setView([43.6112422, 3.8767337], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

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