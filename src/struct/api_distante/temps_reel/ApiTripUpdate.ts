import ApiEndpointBuffer from "../ApiEndpointBuffer";

export default class ApiTripUpdate extends ApiEndpointBuffer {

    public cheminDistant = 'https://data.montpellier3m.fr/TAM_MMM_GTFSRT/TripUpdate.pb';
    public nom = 'Trajets temps réel'; 

    public parser(donneesRaw: Buffer) {

        const arretsJson = this.extraireProtobuf(donneesRaw);

        const donnees = {
            
        }
        
        return true;

    }

}
