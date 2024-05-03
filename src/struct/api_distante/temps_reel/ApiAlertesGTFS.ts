import ApiEndpointBuffer from "../ApiEndpointBuffer";

export default class ApiAlertesGTFS extends ApiEndpointBuffer {

    public cheminDistant = 'https://data.montpellier3m.fr/TAM_MMM_GTFSRT/Alert.pb';
    public nom = 'Trajets temps réel';

    public async parser(donneesRaw: Buffer) {

        const alertes = await this.extraireProtobuf<AlerteRaw[]>(donneesRaw);
        
        console.log(JSON.stringify(alertes[2], null, 2));

        for (const alerte of alertes) {

        }
        
        return true;

    }

}

interface AlerteRaw {
    id: string,
    alert: {
        activePeriod: string[],
        informedEntity: string[],
    }
}