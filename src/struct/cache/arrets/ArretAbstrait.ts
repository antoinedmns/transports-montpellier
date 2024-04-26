export default abstract class ArretAbstrait {

    /**
     * Description (nom de l'arrêt)
     */
    public description: string;

    /**
     * Commune
     */
    public commune: string;

    /**
     * Coordonnées (longitude, latitude)
     */
    public coordonnees: number[];

    /**
     * Ligne associées
     */
    public ligneAssociees: string[];

    /**
     * Arrêt
     */
    constructor(description: string, commune: string, coordonnees: number[], lignes: string[]) {
        this.description = description;
        this.commune = commune;
        this.coordonnees = coordonnees;
        this.ligneAssociees = lignes;
    }

}