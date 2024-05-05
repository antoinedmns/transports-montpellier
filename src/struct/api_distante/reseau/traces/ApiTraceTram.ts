import ApiTraceBase from "./ApiTraceBase";

export default class ApiTraceTram extends ApiTraceBase {

    public cheminDistant = 'https://data.montpellier3m.fr/node/12891/download';
    public nom = 'Tracés tram'; 

    public parser(donneesRaw: string) {

        const geojson = this.extraireKML(donneesRaw);
        this.parserTracesGeoJSON(geojson);

        return true;
        
    }

}
