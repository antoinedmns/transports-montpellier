import ArretBus from "../../../cache/arrets/ArretBus";
import LignesManager from "../../../cache/lignes/LignesManager";
import ApiArretAbstrait from "./ApiArretsAbstrait";

export default class ApiArretBus extends ApiArretAbstrait {

    public cheminDistant = 'https://data.montpellier3m.fr/node/13232/download';
    public nom = 'Arrets bus'; 

    public parser(donneesRaw: string) {

        const arretsJson = this.extraireJSON<JsonApiArretsBus>(donneesRaw);
        return this.parserArrets(arretsJson, LignesManager.bus, ArretBus);

    }

}

interface JsonApiArretsBus {
    type: string,
    name: string,
    features: {
        type: string,
        geometry: {
            coordinates: number[]
        },
        properties: {
            description: string,
            lignes_passantes: string,
            lignes_et_directions: string,
            station: "Arrêt de bus",
            commune: string,
        }
    }[]
}