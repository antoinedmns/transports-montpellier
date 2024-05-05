import { ArretInfo } from "../../../routes/api/arrets/ArretsReseau";
import ArretAggrege from "./ArretAggrege";
import ArretGTSF from "./ArretGTSF";
import ArretPosition from "./ArretPosition";

export default class ArretManager {

    /**
     * Cache des arrêts, indexés par leur ID (stop_id dans le GTFS).\
     * Non-unique : chaque ligne à un arrêt avec un ID unique. Si 3 lignes passent par le même arrêt, il y aura 3 entrées dans ce cache.\
     * Se référer à ArretManager.arretsAggreges pour obtenir les arrêts uniques.
     */
    public static cacheGTFS = new Map<string, ArretGTSF>();

    /**
     * Cache des arrêts GTFS, indexés par leur nom, puis coordonnées.\
     * @example cacheGTFSNom.get('Gare Saint-Roch')['43.6044,3.8787'] renvoie l'arrêt Gare Saint-Roch (GTFS)
     */
    public static cacheGTFSNomPositions = new Map<string, Map<ArretPosition, ArretGTSF>>();

    /**
     * Cache des arrêts agrégés, indexés par leur nom.
     */
    public static cache = new Map<string, ArretAggrege>();

    /**
     * Cache des arrêts, indexés par leur ID d'aggretation.\
     */
    public static cacheId = new Map<string, ArretAggrege>();

    /**
     * Cache parsé, prêt à être envoyé à l'API, indexé par le nom des arrêts
     */
    public static parsed: Record<string, ArretInfo>;

    /**
     * Parser le cache actif (actualiser le cache parsé)
     */
    public static parserArrets() {

        // réinitialiser le cache
        ArretManager.parsed = {};

        for (const arret of ArretManager.cache.values()) {

            ArretManager.parsed[arret.description] = {
                id: arret.id,
                coords: arret.coordonnees,
                nom: arret.description,
                commune: arret.commune,
                lignes: arret.lignes
            }

        }

    }

}