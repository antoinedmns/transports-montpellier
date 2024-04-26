import LignesManager from "../../cache/lignes/LignesManager";
import ApiEndpointAbstract from "../ApiEndpointAbstract";

export default class ApiTraceBus extends ApiEndpointAbstract {

    public cheminDistant = 'https://data.montpellier3m.fr/node/13229/download';
    public nom = 'Tracés bus'; 

    public parser(donneesRaw: string) {

        const geojson = this.extraireKML(donneesRaw);
        
        for (let i = 0; i < geojson.features.length; i++) {

            const feature = geojson.features[i];
            const num_exploitation = feature.properties?.num_exploitation;

            const ligne = LignesManager.bus.cache.get(num_exploitation);
            if (!ligne) continue;

            // on parse les coordonnées du tracé
            // open data renvoie des données super mal formattées (coords pas allignées, des valeurs qui débordent.. donc on s'adapte)
            const geoformes = (feature.geometry as any).coordinates as number[][];
            const parsedGeoformes: number[][] = [];

            for (const geoforme of geoformes) {
                parsedGeoformes.push([geoforme[1], geoforme[0]]);
            }

            // on assigne le tracé a la ligne
            ligne.traces.push(parsedGeoformes);

        }

        return true;

    }

}
