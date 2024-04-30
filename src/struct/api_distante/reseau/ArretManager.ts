import { ArretInfo } from "../../../routes/api/arrets/ArretsReseau";
import ArretAbstrait from "../../cache/arrets/ArretAbstrait";

export default class ArretManager {

    /**
     * Cache des arrêts, indexés par leur noms
     */
    public static cache = new Map<string, ArretAbstrait>();

    /**
     * Cache des arrêts, indexés par leur ID
     */
    public static cacheID = new Map<number, ArretAbstrait>();

    /**
     * Cache parsé, prêt à être envoyé à l'API, indexé par le nom des arrêts
     */
    public static parsed: Record<string, ArretInfo>;

    /**
     * Dernier ID attribué à un arrêt
     */
    private static _lastId = 0;

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
                lignes: arret.ligneAssociees
            }

        }

    }

    /**
     * Obtenir un nouvel ID pour un arrêt
     */
    public static assignerID() {
        return ArretManager._lastId++;
    }

}