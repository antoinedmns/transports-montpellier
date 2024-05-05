import LigneBase, { GTFSRouteType } from "./LigneBase";
import LigneBusManager from "./LigneBusManager";
import LigneTramwayManager from "./LigneTramwayManager";

export default class LignesManager {

    static tramway = new LigneTramwayManager();
    static bus = new LigneBusManager();

    /**
     * Cache des lignes, clé = id GTFS
     */
    static cache = new Map<string, LigneBase>();

    /**
     * Cache des lignes, clé = numéro d'exploitation
     */
    static cacheNum = new Map<string, LigneBase>();

    /**
     * Liste des harmonisations de noms de ligne. La TaM utilise des standards de nommages différents pour les lignes de bus et de tramway.\
     * On essaye de n'utiliser QUE le standard envoyé dans les données GTFS. Cette Map permet de faire la correspondance entre les deux standards.
     */
    static harmonisations = new Map<string, string>();

    /**
     * Générer un fichier CSS représentant les indicteurs de ligne
     */
    public static genererCSS(): string {

        let css = '';

        for (const ligne of LignesManager.cache.values()) {

            // on fait la moyenne RGB de la couleur
            const rgb = (ligne.couleur.match(/[A-Za-z0-9]{2}/g) ?? ['00', '00', '00']).map(e => parseInt(e, 16));
            const moyenne = (rgb[0] + rgb[1] + rgb[2]) / 3;

            css += `.ligne-${ligne.numExploitation}{background-color:${ligne.couleur};` + 

                // si la couleur est trop claire, on colore le texte en noir
                (moyenne > 150 ? 'color:#262626;' : '') + 

            '}';

        }

        return css;

    }

}