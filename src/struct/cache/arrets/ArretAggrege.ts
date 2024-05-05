import { StopTimeUpdate } from "../../api_distante/temps_reel/ApiTripUpdateGTFS";
import LignesManager from "../lignes/LignesManager";
import ArretBase from "./ArretBase";

export default class ArretAggrege extends ArretBase {

    /**
     * ID de l'arrêt aggrégé. Arbitrairement assigné à chaque arrêt aggrégé.
     */
    public id: number;

    /**
     * Dernier ID assigné
     */
    private static _dernierIdAssigne = 0;

    /**
     * Commune
     */
    public commune: string;

    /**
     * Lignes associées
     */
    public lignes: string[];

    /**
     * Liste des directions par ligne
     */
    public directions: { [ligne: string]: string[] };

    /**
     * Passages par ligne, direction et ID de trajet
     * @example passages[<ligne>][<direction>][<id_trajet>] = <timestamp>
     */
    public passages: Record<string, Record<string, Record<string, StopTimeUpdate>>> = {};

    /**
     * Arrêt aggrégé (aggregation des arrêts GTFS en fonction des données distantes GeoJSON)
     * @param description 
     * @param coordonnees 
     * @param commune 
     * @param lignes 
     */
    constructor(description: string, coordonnees: number[], commune: string, lignes: string[], directions: { [ligne: string]: string[] }) {
        super(description, coordonnees);
        this.commune = commune;
        this.lignes = lignes.map(e => LignesManager.harmonisations.get(e) ?? e);
        this.id = ArretAggrege._dernierIdAssigne++;
        this.directions = directions;
    }



}