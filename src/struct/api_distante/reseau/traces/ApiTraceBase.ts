import type { Geometry, FeatureCollection, GeoJsonProperties } from 'geojson';
import LignesManager from '../../../cache/lignes/LignesManager';
import ApiEndpointHTTP from '../../ApiEndpointHTTP';

export default abstract class ApiTraceBase extends ApiEndpointHTTP {

    public parserTracesGeoJSON(geojson: FeatureCollection<Geometry | null, GeoJsonProperties>) {

        for (let i = 0; i < geojson.features.length; i++) {

            const feature = geojson.features[i];
            const num_exploitation = feature.properties?.num_exploitation;

            const ligne = LignesManager.cacheNum.get(LignesManager.harmonisations.get(num_exploitation) ?? num_exploitation);
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
