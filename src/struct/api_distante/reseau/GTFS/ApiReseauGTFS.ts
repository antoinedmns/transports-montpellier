import ArretGTSF from "../../../cache/arrets/ArretGTSF";
import ArretPosition from "../../../cache/arrets/ArretPosition";
import LigneBase, { GTFSRouteType } from "../../../cache/lignes/LigneBase";
import LignesManager from "../../../cache/lignes/LignesManager";
import ApiEndpointHTTP from "../../ApiEndpointHTTP";
import ApiEndpointZip, { FileInfo } from "../../ApiEndpointZip";
import ArretManager from "../../../cache/arrets/ArretManager";

export default class ApiReseauGTFS extends ApiEndpointZip {

    public cheminDistant = 'https://data.montpellier3m.fr/TAM_MMM_GTFSRT/GTFS.zip';
    public nom = 'Métadonnées GTFS'; 

    public async parser(fichiers: Record<string, FileInfo>) {

        /**
         * LIGNES (ROUTES)
         */
        const routesBuffer = await fichiers['routes.txt'].buffer();
        const routesCsv = this.extraireCSV<CsvApiRoutes>(routesBuffer.toString());

        for (let i = 0; i < routesCsv.route_id.length; i++) {

            if (routesCsv.route_id[i] === '') continue;

            // Instancier la ligne
            const ligne = new LigneBase(
                routesCsv.route_id[i],
                '#' + routesCsv.route_color[i],
                routesCsv.route_short_name[i],
                routesCsv.route_long_name[i],
                parseInt(routesCsv.route_type[i]) as GTFSRouteType
            );

            // Ajouter la ligne aux caches
            LignesManager.cache.set(ligne.id, ligne);
            LignesManager.cacheNum.set(ligne.numExploitation, ligne);

            // Ajouter l'harmonisation de nom
            if (ligne.type === GTFSRouteType.BUS) {
                const vInt = parseInt(ligne.numExploitation);
                if (!isNaN(vInt) && vInt < 10) LignesManager.harmonisations.set(vInt.toString(), ligne.numExploitation);
            } else {
                const vInt = parseInt(ligne.numExploitation.slice(1));
                if (!isNaN(vInt)) LignesManager.harmonisations.set(vInt.toString(), ligne.numExploitation);
            }

        }

        /**
         * ARRETS (STOPS)
         */
        const arretsBuffer = await fichiers['stops.txt'].buffer();
        const arretsCsv = this.extraireCSV<CsvApiArrets>(arretsBuffer.toString());

        for (let i = 0; i < arretsCsv.stop_id.length; i++) {

            // Instancier l'arrêt
            const arret = new ArretGTSF(arretsCsv.stop_id[i], arretsCsv.stop_name[i],
                [parseFloat(arretsCsv.stop_lon[i]), parseFloat(arretsCsv.stop_lat[i])]);

            // Ajouter l'arrêt au cache
            ArretManager.cacheGTFS.set(arret.id, arret);

            // Ajouter l'arrêt au cache par nom et coordonnées
            let arretNomCoord = ArretManager.cacheGTFSNomPositions.get(arret.description);
            const position = new ArretPosition(arret.coordonnees[0], arret.coordonnees[1]);

            if (!arretNomCoord) {
                arretNomCoord = new Map<ArretPosition, ArretGTSF>();
                ArretManager.cacheGTFSNomPositions.set(arret.description, arretNomCoord);
            }

            arretNomCoord.set(position, arret);

        }

        /**
         * TRAJETS (TRIPS)
         */
        const tripsBuffer = await fichiers['trips.txt'].buffer();
        const tripsCsv = this.extraireCSV<CsvApiTrips>(tripsBuffer.toString());

        for (let i = 0; i < tripsCsv.route_id.length; i++) {

            const ligne = LignesManager.cache.get(tripsCsv.route_id[i]);
            if (!ligne) continue;

            ligne.trajets[tripsCsv.trip_id[i]] = tripsCsv.trip_headsign[i];

        }

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

interface CsvApiRoutes {
    route_id: string[]
    agency_id: string[]
    route_short_name: string[]
    route_long_name: string[]
    route_desc: string[]
    route_type: string[]
    route_url: string[]
    route_color: string[]
    route_text_color: string[]
}

interface CsvApiTrips {
    route_id: string[]
    service_id: string[]
    trip_id: string[]
    trip_headsign: string[]
    direction_id: string[]
}