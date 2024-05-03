import LignesManager from "../../cache/lignes/LignesManager";
import ApiEndpointHTTP from "../ApiEndpointHTTP";
import ApiEndpointZip from "../ApiEndpointZip";

export default class ApiReseauGTFS extends ApiEndpointZip {

    public cheminDistant = 'https://data.montpellier3m.fr/node/13366/download';
    public nom = 'Métadonnées GTFS'; 

    public parser(donneesRaw: string) {

        console.log(donneesRaw);
        return true;

    }

}
