import ApiEndpointAbstract from "../ApiEndpointAbstract";

export default class ApiTripUpdate extends ApiEndpointAbstract {

    public cheminDistant = 'https://data.montpellier3m.fr/TAM_MMM_GTFSRT/TripUpdate.pb';
    public nom = 'Trajets temps réel'; 

    public parser(donneesRaw: string) {

        const arretsJson = this.extraireProtobuf<JsonApiArretsBus>(donneesRaw);

        const donnees = {
            
        }
        
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