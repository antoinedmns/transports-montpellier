import ArretBus from "../../cache/arrets/ArretBus";
import ArretTramway from "../../cache/arrets/ArretTramway";
import LigneBus, { ReseauBus } from "../../cache/lignes/LigneBus";
import LignesManager from "../../cache/lignes/LignesManager";
import ApiEndpointAbstract from "../ApiEndpointAbstract";
import ArretManager from "./ArretManager";

export default class ApiArretBus extends ApiEndpointAbstract {

    public cheminDistant = 'https://data.montpellier3m.fr/node/13232/download';
    public nom = 'Arrets bus'; 

    public parser(donneesRaw: string) {

        const arretsJson = this.extraireJSON<JsonApiArretsBus>(donneesRaw);
        
        for (const feature of arretsJson.features) {

            const ligne = LignesManager.bus.cache.get(feature.properties.lignes_passantes);
            
            if (ligne) {

                let arretEnCache = ArretManager.cache.get(feature.properties.description);

                // si l'arrêt est déjà en cache
                if (arretEnCache) {
                    
                    // sinon on ajoute la ligne à l'arrêt
                    if (!arretEnCache.ligneAssociees.includes(ligne.numExploitation))
                        arretEnCache.ligneAssociees.push(ligne.numExploitation);

                } else {

                    // on ajoute l'arrêt au cache
                    arretEnCache = new ArretBus(feature.properties.description, feature.properties.commune, feature.geometry.coordinates, [ligne.numExploitation]);
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

interface JsonApiArretsBus {
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
            station: "Arrêt de bus",
            commune: string,
        }
    }[]
}