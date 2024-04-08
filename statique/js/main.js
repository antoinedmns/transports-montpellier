class CoordinateurContenu {   

    // Chemin vers la page actuelle
    pageActuelle;

    // Elements de navigation
    navElements = new Map();

    // Cache des éléments actuels
    cacheElements = new Map();

    // Element d'affichage du contenu dans le cadre contextuel
    static ELEMENT_CONTENU_CADRE = document.getElementById('cadreContenu');

    /**
     * Initier un coordinateur de contenu
     * @param {*} pageDepart Chemin vers la première page à afficher (affichera l'accueil par défaut)
     */
    constructor(pageDepart = 'itineraires') {

        // Récupérer tous les éléments de la barre de navigation, et les lier
        document.querySelectorAll('div[data-nav-page]').forEach((elm) => {
            const cheminPage = elm.getAttribute('data-nav-page');
            this.navElements.set(cheminPage, elm);
            elm.addEventListener('click', () => { this.chargerPage(cheminPage); });
        });

        // Charger la page de départ
        this.chargerPage(pageDepart);

    }

    /**
     * Actualise le contenu de la page affichée
     */
    async actualiserPage() {

        console.log('contenus/' + this.pageActuelle)
        CoordinateurContenu.ELEMENT_CONTENU_CADRE.innerHTML = 'CHARGEMENT EN COURS......';
        const resultat = await fetch('contenus/' + this.pageActuelle);
        CoordinateurContenu.ELEMENT_CONTENU_CADRE.innerHTML = await resultat.text();
        
        // Parser les balises SCRIPT
        Array.from(CoordinateurContenu.ELEMENT_CONTENU_CADRE.querySelectorAll("script")).forEach( oldScriptEl => {

            const newScriptEl = document.createElement("script");
            
            Array.from(oldScriptEl.attributes).forEach( attr => {
                newScriptEl.setAttribute(attr.name, attr.value) 
            });
            
            const scriptText = document.createTextNode(oldScriptEl.innerHTML);
            newScriptEl.appendChild(scriptText);
            
            oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);

        });
    }

    /**
     * Charger une page
     */
    async chargerPage(chemin) {

        // Actualiser la barre de navigation
        const navElm = this.navElements.get(chemin);
        const currNavElm = this.navElements.get(this.pageActuelle);

        if (navElm) navElm.classList.add('active');
        if (currNavElm) currNavElm.classList.remove('active');

        this.pageActuelle = chemin;
        this.actualiserPage();

    }

}

const coordinateur = new CoordinateurContenu();