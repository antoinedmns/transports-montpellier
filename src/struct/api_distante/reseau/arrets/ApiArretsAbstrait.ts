import ArretBus from "../../../cache/arrets/ArretBus";
import ArretTramway from "../../../cache/arrets/ArretTramway";
import LigneBusManager from "../../../cache/lignes/LigneBusManager";
import LigneTramwayManager from "../../../cache/lignes/LigneTramwayManager";
import ApiEndpointAbstract from "../../ApiEndpointAbstract";
import ArretManager from "../ArretManager";

export default abstract class ApiArretAbstrait extends ApiEndpointAbstract {

    /**
     * Paser les données et les ajouter au cache respectif
     * @param arretsJson la liste des arrets au format GeoJSON
     * @param manager le manager de ligne associé
     * @param constructeurArret le constructeur de l'arrêt (pour instancier l'arrêt)
     * @returns 
     */
    public parserArrets(arretsJson: JsonApiArretsDonnees, manager: LigneBusManager | LigneTramwayManager, constructeurArret: typeof ArretBus | typeof ArretTramway) {
        
        for (const feature of arretsJson.features) {

            // lignes et directions de l'arrêt
            const lignesPassantes = feature.properties.lignes_passantes.split('; ');
            const directionsPassantes = feature.properties.lignes_et_directions.split('; ');

            for (let i = 0; i < lignesPassantes.length; i++) {

                // numéro d'exploitation de la ligne
                const ligneNum = lignesPassantes[i];

                // récupérer les directions
                // ex: '1 Mosson; 1 Odysseum; 6 Euromédecine; 6 Antennes' => ['Mosson', 'Odysseum']
                const directions = [];
                for (const direction of directionsPassantes) {
                    if (direction.startsWith(ligneNum)) {
                        directions.push(direction.slice(ligneNum.length + 1));
                    }
                }

                if (!ligneNum) continue;

                // récupérer la ligne associée dans le cache
                const ligne = manager.cache.get(ligneNum);

                if (ligne) {

                    let arretEnCache = ArretManager.cache.get(feature.properties.description);
                    let nomArret = feature.properties.description;

                    // si l'arrêt est déjà en cache mais sur une autre commune
                    // (exemple: 'Mairie' est le nom de plusieurs arrêts dans plusieurs communes)
                    if (arretEnCache && arretEnCache.commune !== feature.properties.commune) {

                        // préciser la commune de l'arrêt
                        nomArret += ` (${feature.properties.commune})`;

                        // mettre à jour l'arrêt en cache
                        arretEnCache = ArretManager.cache.get(nomArret);

                    }

                    // si l'arrêt est déjà en cache
                    if (arretEnCache) {
                        
                        // sinon on ajoute la ligne à l'arrêt
                        if (!arretEnCache.ligneAssociees.includes(ligne.numExploitation))
                            arretEnCache.ligneAssociees.push(ligne.numExploitation);

                    } else {

                        // on ajoute l'arrêt au cache
                        arretEnCache = new constructeurArret(ArretManager.assignerID(), nomArret, feature.properties.commune, feature.geometry.coordinates, []);
                        ArretManager.cache.set(nomArret, arretEnCache);
                        ArretManager.cacheID.set(arretEnCache.id, arretEnCache);
                    
                    }

                    // directions de l'arrêt pour la ligne
                    const directionsLigne = arretEnCache.directions[ligne.numExploitation];

                    // ajouter la/les direction.s à l'arrêt
                    if (directionsLigne) {

                        for (const direction of directions) {
                            if (!directionsLigne.includes(direction))
                                directionsLigne.push(direction);
                        }

                    } else {

                        arretEnCache.directions[ligne.numExploitation] = directions;

                    }
                    
                    ligne.arrets.set(nomArret, arretEnCache);

                }

            }

        }

        // on parse les arrêts et on met à jour le cache
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