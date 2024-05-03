import LigneBusManager from "./LigneBusManager";
import LigneTramwayManager from "./LigneTramwayManager";

export default class LignesManager {

    static tramway = new LigneTramwayManager();
    static bus = new LigneBusManager();

    /**
     * Générer un fichier CSS représentant les indicteurs de ligne
     */
    public static genererCSS(): string {

        let css = '';

        for (const cache of [LignesManager.tramway, LignesManager.bus]) {

            for (const ligne of cache.cache.values()) {

                // on fait la moyenne RGB de la couleur
                const rgb = (ligne.couleur.match(/[A-Za-z0-9]{2}/g) ?? ['00', '00', '00']).map(e => parseInt(e, 16));
                const moyenne = (rgb[0] + rgb[1] + rgb[2]) / 3;

                css += `.ligne-${ligne.numExploitation}{background-color:${ligne.couleur};` + 

                    // si la couleur est trop claire, on colore le texte en noir
                    (moyenne > 150 ? 'color:#262626;' : '') + 

                '}';

            }

        }

        return css;

    }

}