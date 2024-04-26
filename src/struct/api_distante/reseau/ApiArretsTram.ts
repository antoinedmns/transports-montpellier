import ArretTramway from "../../cache/arrets/ArretTramway";
import LigneBus, { ReseauBus } from "../../cache/lignes/LigneBus";
import LignesManager from "../../cache/lignes/LignesManager";
import ApiEndpointAbstract from "../ApiEndpointAbstract";
import ArretManager from "./ArretManager";

export default class ApiArretTram extends ApiEndpointAbstract {

    public cheminDistant = 'https://data.montpellier3m.fr/node/12865/download';
    public nom = 'Arrets tram'; 

    public parser(donneesRaw: string) {

        const arretsJson = this.extraireJSON<JsonApiArretsTram>(donneesRaw);
        
        for (const feature of arretsJson.features) {

            const ligne = LignesManager.tramway.cache.get(feature.properties.lignes_passantes);
            
            if (ligne) {

                let arretEnCache = ArretManager.cache.get(feature.properties.description);

                // si l'arrêt est déjà en cache
                if (arretEnCache) {
                    
                    // sinon on ajoute la ligne à l'arrêt
                    if (!(ligne.numExploitation in arretEnCache.ligneAssociees))
                        arretEnCache.ligneAssociees.push(ligne.numExploitation);

                } else {

                    // on ajoute l'arrêt au cache
                    arretEnCache = new ArretTramway(feature.properties.description, feature.properties.commune, feature.geometry.coordinates, [ligne.numExploitation]);
                    ArretManager.cache.set(feature.properties.description, arretEnCache);
                
                }
                
                ligne.arrets.set(feature.properties.description, arretEnCache);

            }

        }

        // on parse les arrêts et on met à jour le cache
        ArretManager.parserArrets();

        return true;

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
            lignes_et_direction: string,
            station: "Station de tramway",
            commune: string,
        }
    }[]
}