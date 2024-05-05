import ArretGTSF from "../arrets/ArretGTSF";

export default class LigneBase {

    /**
     * ID GTFS de la ligne
     */
    public id: string;

    /**
     * Couleur assignée à la ligne
     */
    public couleur: string;

    /**
     * Numéro d'exploitation de la ligne
     */
    public numExploitation: string;

    /**
     * Nom complet de la ligne
     */
    public nomComplete: string;

    /**
     * Type de la ligne
     */
    public type: GTFSRouteType;

    /**
     * Arrêts de la ligne, indexés par leur id GTFS
     */
    public arrets = new Map<string, ArretGTSF>();

    /**
     * Tracé de la ligne au format GeoJSON
     */
    public traces: number[][][] = [];

    /**
     * Liste des trajets de la ligne, et de la destination (clé = id trajet, valeur = destination)
     */
    public trajets: Record<string, string> = {};

    /**
     * Ligne
     */
    constructor(id: string, couleur: string, numExploitation: string, nomComplete: string, type: GTFSRouteType) {
        this.id = id;
        this.couleur = couleur;
        this.numExploitation = numExploitation;
        this.nomComplete = nomComplete;
        this.type = type;
    }

}

export enum GTFSRouteType {
    TRAMWAY = 0,
    SUBWAY = 1,
    RAIL = 2,
    BUS = 3,
    FERRY = 4,
    CABLE_CAR = 5,
    GONDOLA = 6,
    FUNICULAR = 7
}