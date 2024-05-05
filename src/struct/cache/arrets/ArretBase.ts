export default class ArretBase {

    /**
     * Description (nom de l'arrêt)
     */
    public description: string;

    /**
     * Coordonnées (longitude, latitude)
     */
    public coordonnees: number[];

    /**
     * Arrêt
     */
    constructor(description: string, coordonnees: number[]) {
        this.description = description;
        this.coordonnees = coordonnees;
    }

}