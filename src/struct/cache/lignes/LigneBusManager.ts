import LigneBus from "./LigneBus";
import LigneManagerAbstrait from "./LigneManagerAbstrait";

export default class LigneBusManager extends LigneManagerAbstrait<LigneBus> {

    /**
     * Ajouter une ligne au cache
     */
    public ajouter(ligne: LigneBus): this {

        this.cache.set(ligne.numExploitation, ligne);
        return this;

    }

}