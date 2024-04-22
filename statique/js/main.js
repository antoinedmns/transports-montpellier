class CoordinateurContenu {   

    // Chemin vers la page actuelle
    pageActuelle;

    // Elements de navigation
    navElements = new Map();

    // Cache des éléments actuels
    cacheElements = new Map();

    // Coordinateur de l'API
    api = new CoordinateurAPI();

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

        // Vider le cache API
        this.api.cacheElements.clear();

        // Afficher un message de chargement
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

class CoordinateurAPI {

    // Cache des éléments liés au cache
    cacheElements = new Map();

    /**
     * Envoyer une requête GET à une API JSON, et renvoyer les données parsées
     * @param {string} url chemin de l'API (/api/... pour l'API locale)
     */
    async getAPI(url) {
        console.log('GET', url);
        const resultat = await fetch(url).catch((err) => { console.warn('Requête GET vers', url, 'échouée'); console.error(err); });
        return await resultat.json();
    }
    
    /**
     * Envoyer une requête POST à une API JSON, et renvoyer les données parsées
     * @param {string} url chemin de l'API (/api/... pour l'API locale)
     * @param {object} data Données à envoyer
     */
    async postAPI(url, data) {
        const resultat = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await resultat.json();
    }

    /**
     * Récupérer ou ajouter un élément au cache DOM
     * @param {string} id ID de l'élément à récupérer
     * @returns {Element} Element DOM
     */
    recupererCache(id) {
        if (!this.cacheElements.has(id)) this.cacheElements.set(id, document.getElementById(id));
        return this.cacheElements.get(id);
    }

}

const coordinateur = new CoordinateurContenu();