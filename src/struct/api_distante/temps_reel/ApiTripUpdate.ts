import ApiEndpointBuffer from "../ApiEndpointBuffer";

export default class ApiTripUpdate extends ApiEndpointBuffer {

    public cheminDistant = 'https://data.montpellier3m.fr/TAM_MMM_GTFSRT/TripUpdate.pb';
    public nom = 'Trajets temps réel'; 

    public parser(donneesRaw: Buffer) {

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