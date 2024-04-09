export default abstract class LigneAbstrait {

    /**
     * Couleur assignée à la ligne
     */
    public couleur: string = '11499F';

    /**
     * Numéro commercial de la ligne
     */
    public numCommercial: string = '0';

    /**
     * Numéro d'exploitation de la ligne
     */
    public numExploitation: string = '0';

    /**
     * Nom complet de la ligne
     * Exemple: L43 Pignan (La Bornière) > Saussan > Fabrègues > Saint-Jean de Védas (Centre)
     */
    // public nomComplet: string = 'non défini';

    /**
     * Ligne de transports
     */
    constructor(numCommercial: string, numExploitation: string, couleur: string) {

        this.numCommercial = numCommercial;
        this.numExploitation = numExploitation;
        // this.nomComplet = nomComplet;
        this.couleur = couleur;

    }

}