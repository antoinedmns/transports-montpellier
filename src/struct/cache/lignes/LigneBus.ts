import ArretBus from "../arrets/ArretBus";
import LigneAbstrait from "./LigneAbstrait"

export default class LigneBus extends LigneAbstrait<ArretBus> {

    // Réseau de rattachement de la ligne
    // Urbain = Montpellier intramuros, Suburbain = Montpellier Métropole
    reseau: ReseauBus;

    constructor(id: string, nom: string, couleur: string, reseau: ReseauBus) {
        super(id, nom, couleur);
        this.reseau = reseau;
    }

}

export enum ReseauBus {
    Urbain,
    Suburbain
}