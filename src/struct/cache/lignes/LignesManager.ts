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

        for (const ligne of LignesManager.tramway.cache.values()) {
            css += `.ligne-${ligne.numExploitation}{background-color:${ligne.couleur}};`
        }

        return css;

    }

}