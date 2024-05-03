import ArretBus from "../arrets/ArretBus";
import ArretTramway from "../arrets/ArretTramway";

export default abstract class LigneAbstrait<D extends ArretTramway | ArretBus> {

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
     * Cache des arrêts de la ligne, indexé par nom
     */
    public arrets = new Map<string, D>();

    /**
     * Cache des trajets de la ligne
     */
    public trajets = new Map<string, D>();

    /**
     * Tracés de la ligne
     */
    public traces: number[][][] = [];

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