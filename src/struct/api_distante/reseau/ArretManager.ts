import { ArretInfo } from "../../../routes/api/arrets/ArretsReseau";
import ArretAbstrait from "../../cache/arrets/ArretAbstrait";

export default class ArretManager {

    /**
     * Cache des arrêts, indexés par leur noms
     */
    public static cache = new Map<string, ArretAbstrait>();

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
                coords: arret.coordonnees,
                nom: arret.description,
                commune: arret.commune,
                lignes: arret.ligneAssociees
            }

        }

    }

}