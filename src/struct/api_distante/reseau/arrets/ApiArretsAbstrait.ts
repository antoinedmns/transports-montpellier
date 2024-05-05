import ArretAggrege from "../../../cache/arrets/ArretAggrege";
import ArretGTSF from "../../../cache/arrets/ArretGTSF";
import ArretBus from "../../../cache/arrets/ArretBus";
import ArretTramway from "../../../cache/arrets/ArretTramway";
import LigneBusManager from "../../../cache/lignes/LigneBusManager";
import LigneTramwayManager from "../../../cache/lignes/LigneTramwayManager";
import Logger from "../../../internal/Logger";
import ApiEndpointHTTP from "../../ApiEndpointHTTP";
import ArretManager from "../../../cache/arrets/ArretManager";
import LignesManager from "../../../cache/lignes/LignesManager";

export default abstract class ApiArretAbstrait extends ApiEndpointHTTP {

    /**
     * Paser les données et les ajouter au cache respectif
     * @param arretsJson la liste des arrets au format GeoJSON
     * @returns 
     */
    public parserArrets(arretsJson: JsonApiArretsDonnees) {
        
        // pour chaque arrêt dans les données GeoJSON reçues
        for (const feature of arretsJson.features) {

            // récupérer les arrêts GTFS
            const arretsPositionsGTFS = ArretManager.cacheGTFSNomPositions.get(feature.properties.description);
            if (!arretsPositionsGTFS) continue;

            let nomArret = feature.properties.description;

            // Si l'arrêt est déjà dans le cache (mais sur une autre commune), préciser la commune
            const preCacheArretAggrege = ArretManager.cache.get(nomArret);
            if (preCacheArretAggrege) {
            
                if (preCacheArretAggrege.commune !== feature.properties.commune) {

                    // Ajouter la commune à la description
                    nomArret += ' (' + feature.properties.commune + ')';

                }

            }

            // Si l'arrêt est déjà dans le cache, le mettre à jour
            if (ArretManager.cache.has(nomArret)) {

                const arret = ArretManager.cache.get(nomArret);
                if (!arret) continue;

                for (const ligne of feature.properties.lignes_passantes.split('; ')) {
                    const ligneHarmonisee = LignesManager.harmonisations.get(ligne) ?? ligne;
                    if (arret.lignes.includes(ligneHarmonisee)) continue;
                    arret.lignes.push(ligneHarmonisee);
                }

                continue;

            }


            const directions: Record<string, string[]> = {};

            // Création de l'arrêt aggregé
            const aggreg = new ArretAggrege(
                nomArret,
                feature.geometry.coordinates,
                feature.properties.commune,
                feature.properties.lignes_passantes.split('; '),
                directions
            );

            // vérifier si chaque arrêt GTFS est à proximité de l'arrêt GeoJSON, et les associer
            let trouveArretGTFS = false;
            for (const [position, arret] of arretsPositionsGTFS) {

                if (position.estProcheCoordonnees(feature.geometry.coordinates[0], feature.geometry.coordinates[1], 0.003, 0.003)) {
                    trouveArretGTFS = true;
                    arret.definirArretAggrege(aggreg);
                }
                
            }

            // Aucune correspondance trouvée
            // C'est à dire qu'aucun arrêt GTFS n'a été trouvé à proximité de l'arrêt GeoJSON
            // La distance maximale est configurée à 0.003 degrés, soit environ 333m
            if (!trouveArretGTFS) {
                Logger.log.warn('GeoJSON', 'Aucune correspondance GTFS trouvée pour l\'arrêt ', nomArret, '. Arrêt ignoré.');
                continue;
            }

            // Ajout de l'arrêt au cache
            ArretManager.cache.set(aggreg.description, aggreg);
            ArretManager.cacheId.set(aggreg.id.toString(), aggreg);

        }

        Logger.log.success('GeoJSON', 'Aggregation de ', arretsJson.features.length, ' GeoJSON avec GTFS terminée.');

        // Parser les arrêts
        ArretManager.parserArrets();

        return true;

    }

}

interface JsonApiArretsDonnees {
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
            station: "Arrêt de bus" | "Station de tramway",
            commune: string,
        }
    }[]
}