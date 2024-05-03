import LignesManager from "../../cache/lignes/LignesManager";
import ApiEndpointHTTP from "../ApiEndpointHTTP";
import ApiEndpointZip, { FileInfo } from "../ApiEndpointZip";

export default class ApiReseauGTFS extends ApiEndpointZip {

    public cheminDistant = 'https://data.montpellier3m.fr/TAM_MMM_GTFSRT/GTFS.zip';
    public nom = 'Métadonnées GTFS'; 

    public async parser(fichiers: Record<string, FileInfo>) {

        // Arrêts
        const arretsBuffer = await fichiers['stops.txt'].buffer();
        const arretsCsv = this.extraireCSV<CsvApiArrets>(arretsBuffer.toString());
        console.log(arretsCsv)

        const routesBuffer = await fichiers['routes.txt'].buffer();
        const routesCsv = this.extraireCSV(routesBuffer.toString());
        console.log(routesCsv)

        const tripsBuffer = await fichiers['trips.txt'].buffer();
        const tripsCsv = this.extraireCSV(tripsBuffer.toString());
        console.log(tripsCsv)

        return true;

    }

}

interface CsvApiArrets {
    stop_id: string[]
    stop_code: string[]
    stop_name: string[]
    stop_lat: string[]
    stop_lon: string[]
}