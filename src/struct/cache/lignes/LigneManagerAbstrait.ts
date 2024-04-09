import LigneBus from "./LigneBus";
import LigneTramway from "./LigneTramway";

export default abstract class LigneManagerAbstrait<T extends LigneBus | LigneTramway> {

    /**
     * Lignes mises en cache
     */
    public cache: Map<string, T> = new Map();

    /**
     * Ajouter une ligne au cache
     */
    public abstract ajouter(ligne: T): this;

}