import LignesManager from "../../../cache/lignes/LignesManager";
import ApiEndpointHTTP from "../../ApiEndpointHTTP";
import ApiTraceBase from "./ApiTraceBase";

export default class ApiTraceBus extends ApiTraceBase {

    public cheminDistant = 'https://data.montpellier3m.fr/node/13229/download';
    public nom = 'Tracés bus'; 

    public parser(donneesRaw: string) {

        const geojson = this.extraireKML(donneesRaw);
        this.parserTracesGeoJSON(geojson);

        return true;
        
    }

}
