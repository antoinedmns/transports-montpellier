import LignesManager from "../../cache/lignes/LignesManager";
import ApiEndpointBuffer from "../ApiEndpointBuffer";
import ArretManager from "../../cache/arrets/ArretManager";
import Logger from "../../internal/Logger";

export default class ApiTripUpdate extends ApiEndpointBuffer {

    public cheminDistant = 'https://data.montpellier3m.fr/TAM_MMM_GTFSRT/TripUpdate.pb';
    public nom = 'Trajets temps réel'; 

    public async parser(donneesRaw: Buffer) {

        const tripUpdatesJSON = await this.extraireProtobuf<TripUpdate[]>(donneesRaw);
        Logger.log.success('Trajets', 'Décodage de ', tripUpdatesJSON.length + ' trajets', ' temps réel');

        // Réinitialiser tous les passages dans le cache
        for (const arret of ArretManager.cache.values()) {
            arret.passages = {};
        }

        for (let i = 0; i < tripUpdatesJSON.length; i++) {
            
            const tripUpdate = tripUpdatesJSON[i];
            const ligne = LignesManager.cache.get(tripUpdate.tripUpdate.trip.routeId);
            if (!ligne) console.log('ligne ' + tripUpdate.tripUpdate.trip.routeId + ' non trouvée');
            if (!ligne) continue;

            const stops = tripUpdate.tripUpdate.stopTimeUpdate || [];
            for (const stopTimeUpdate of stops) {

                // récupérer l'arrêt depuis le cache (ou le créer si inexistant)
                let arret = ligne.arrets.get(stopTimeUpdate.stopId);
                if (!arret) {

                    arret = ArretManager.cacheGTFS.get(stopTimeUpdate.stopId);
                    if (!arret) Logger.log.error('Arret', 'Arrêt ' + stopTimeUpdate.stopId + ' non trouvé');
                    if (!arret) continue;

                    ligne.arrets.set(arret.id, arret);
                
                }

                // ajouter le passage à l'arrêt
                const arretAgg = arret.arretAggrege;
                if (!arretAgg) continue;

                // NUM EXPLOITATION
                let passagesLigne = arretAgg.passages[ligne.numExploitation];
                if (!passagesLigne) {

                    passagesLigne = {}
                    arretAgg.passages[ligne.numExploitation] = passagesLigne;

                }

                // DIRECTION
                let passagesDirection = passagesLigne[tripUpdate.tripUpdate.trip.directionId];
                if (!passagesDirection) {

                    passagesDirection = {}
                    passagesLigne[tripUpdate.tripUpdate.trip.directionId] = passagesDirection;

                }

                // TRAJET
                let passagesTrajet = passagesDirection[tripUpdate.tripUpdate.trip.tripId];
                if (!passagesTrajet) passagesDirection[tripUpdate.tripUpdate.trip.tripId] = stopTimeUpdate;

            }

        }
        
        return true;

    }

}

interface TripUpdate {
    id: string
    tripUpdate: {
        trip: {
            tripId: string
            routeId: string
            scheduleRelationship: 'SCHEDULED' | 'ADDED' | 'UNSCHEDULED'
            directionId: string
        }
        stopTimeUpdate: StopTimeUpdate[]
        vehicle?: {
            id: string,
            label: string
        }
        timestamp: number
    }
}

export interface StopTimeUpdate {
    stopId: string
    arrival?: {
        time: number,
        delay?: number
    }
    departure: {
        time: number,
        delay?: number
    }
    scheduleRelationship: 'SCHEDULED' | 'SKIPPED' | 'NO_DATA'
}