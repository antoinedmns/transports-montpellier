import LigneManagerAbstrait from "./LigneManagerAbstrait";
import LigneTramway from "./LigneTramway";

export default class LigneTramwayManager extends LigneManagerAbstrait<LigneTramway> {

    /**
     * Ajouter une ligne au cache
     */
    public ajouter(ligne: LigneTramway): this {

        this.cache.set(ligne.numExploitation, ligne);
        return this;

    }

}