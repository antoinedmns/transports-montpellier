import LigneBus, { ReseauBus } from "../../cache/lignes/LigneBus";
import LignesManager from "../../cache/lignes/LignesManager";
import ApiEndpointHTTP from "../ApiEndpointHTTP";

export default class ApiTempsReel extends ApiEndpointHTTP {

    public cheminDistant = 'https://data.montpellier3m.fr/node/13372/download';
    public nom = 'Données temps réel'; 

    public parser(donneesRaw: string) {

        const csv = this.extraireCSV<CsvApiTempsReel>(donneesRaw, ';');
        
        for (let i = 0; i < csv.route_short_name.length; i++) {

            const ligne = LignesManager.tramway.cache.get(csv.route_short_name[i])
                ?? LignesManager.bus.cache.get(csv.route_short_name[i])

            ligne?.arrets

        }

        return true;

    }

}

interface CsvApiTempsReel {
    course: string[],
    stop_code: string[],
    stop_id: string[],
    stop_name: string[],
    route_short_name: string[],
    trip_headsign: string[],
    direction_id: string[],
    departure_time: string[],
    is_theorical: string[],
    delay_sec: string[],
    dest_ar_code: string[],
    course_sae: string[]
}