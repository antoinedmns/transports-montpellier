import ArretAggrege from "./ArretAggrege";
import ArretBase from "./ArretBase";

export default class ArretGTSF extends ArretBase {

    /**
     * ID GTSF de l'arrêt.
     */
    public id: string;

    /**
     * Arrêt aggrégé associé
     */
    public arretAggrege: ArretAggrege | null = null;

    /**
     * Arrêt
     */
    constructor(id: string, description: string, coordonnees: number[]) {
        super(description, coordonnees);
        this.id = id;
    }

    /**
     * Définir l'arrêt aggrégé associé
     */
    public definirArretAggrege(arretAggrege: ArretAggrege) {
        this.arretAggrege = arretAggrege;
    }

}