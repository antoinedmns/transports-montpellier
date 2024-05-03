export default abstract class ArretAbstrait {

    /**
     * ID de l'arrêt.\
     * N'est pas hérité de l'API distante, et est arbitrairement attribué par le programme à chaque démarrage.
     */
    public id: number;

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
     * Liste des directions par ligne
     */
    public directions: { [ligne: string]: string[] } = {};

    /**
     * Arrêt
     */
    constructor(id: number, description: string, commune: string, coordonnees: number[], lignes: string[]) {
        this.id = id;
        this.description = description;
        this.commune = commune;
        this.coordonnees = coordonnees;
        this.ligneAssociees = lignes;
    }

}