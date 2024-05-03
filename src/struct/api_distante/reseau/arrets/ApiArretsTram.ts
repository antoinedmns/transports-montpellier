import ArretTramway from "../../../cache/arrets/ArretTramway";
import LignesManager from "../../../cache/lignes/LignesManager";
import ApiArretAbstrait from "./ApiArretsAbstrait";

export default class ApiArretTram extends ApiArretAbstrait {

    public cheminDistant = 'https://data.montpellier3m.fr/node/12865/download';
    public nom = 'Arrets tram'; 

    public parser(donneesRaw: string) {

        const arretsJson = this.extraireJSON<JsonApiArretsTram>(donneesRaw);
        return this.parserArrets(arretsJson, LignesManager.tramway, ArretTramway);
    
    }

}

interface JsonApiArretsTram {
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
            station: "Station de tramway",
            commune: string,
        }
    }[]
}