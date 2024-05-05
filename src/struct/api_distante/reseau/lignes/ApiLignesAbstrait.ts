import ArretAggrege from "../../../cache/arrets/ArretAggrege";
import ArretGTSF from "../../../cache/arrets/ArretGTSF";
import ArretBus from "../../../cache/arrets/ArretBus";
import ArretTramway from "../../../cache/arrets/ArretTramway";
import LigneBusManager from "../../../cache/lignes/LigneBusManager";
import LigneTramwayManager from "../../../cache/lignes/LigneTramwayManager";
import Logger from "../../../internal/Logger";
import ApiEndpointHTTP from "../../ApiEndpointHTTP";
import ArretManager from "../../../cache/arrets/ArretManager";

export default abstract class ApiLignesAbstrait extends ApiEndpointHTTP {

    /**
     * Paser les données et les ajouter au cache respectif
     * @param arretsJson la liste des lignes au format GeoJSON
     * @param prefixe le préfixe à ajouter aux noms des lignes (ex: 'T' pour les lignes de tramway)
     * @returns 
     */
    public parserLignes(arretsJson: JsonApiArretsDonnees, prefixe: string | null = null) {
        
        // Association GTSF <-> GeoJSON nécessaire?
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