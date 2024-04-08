class CoordinateurContenu {   

    // Chemin vers la page actuelle
    pageActuelle;

    // Cache des éléments actuels
    cacheElements = new Map();

    // Element d'affichage du contenu dans le cadre contextuel
    static ELEMENT_CONTENU_CADRE = document.getElementById('cadreContenu');

    /**
     * Initier un coordinateur de contenu
     * @param {*} pageActuelle Chemin vers la première page à afficher (affichera l'accueil par défaut)
     */
    constructor(pageActuelle = 'itineraires') {

        this.chargerPage(pageActuelle);

    }

    /**
     * Actualise le contenu de la page affichée
     */
    async actualiserPage() {

        console.log('contenus/' + this.pageActuelle)
        CoordinateurContenu.ELEMENT_CONTENU_CADRE.innerHTML = 'CHARGEMENT EN COURS......';
        const resultat = await fetch('contenus/' + this.pageActuelle);
        CoordinateurContenu.ELEMENT_CONTENU_CADRE.innerHTML = await resultat.text();

    }

    /**
     * Charger une page
     */
    async chargerPage(chemin) {

        this.pageActuelle = chemin;
        this.actualiserPage();

    }

}

const coordinateur = new CoordinateurContenu();