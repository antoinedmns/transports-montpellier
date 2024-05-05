import request from 'request';
import Logger from '../internal/Logger';
import { kml } from "@tmcw/togeojson";
import { DOMParser } from 'xmldom';
import type { Geometry, FeatureCollection, GeoJsonProperties } from 'geojson';
import ApiEndpointAbstract from './ApiEndpointAbstract';

export default abstract class ApiEndpointHTTP extends ApiEndpointAbstract<string> {
    
    /**
     * Récupérer les données du fichier distant à l'adresse donnée dans la propriété 'cheminDistant".
     * @returns Le contenu du fichier distant, au format texte
     */
    public async recupererDonnees(): Promise<string> {

        const horodatageDebut = Date.now();

        return await new Promise((resolve, reject) => {
        
            request.get(this.cheminDistant, (error, response, body) => {

                // Si les données distantes ont été récupérées, on résout avec le corps de la requête
                if (!error && response.statusCode == 200) {

                    Logger.log.success('Api', 'Données distantes ', this.nom, ' récupérées en ', Date.now() - horodatageDebut + 'ms', '.');
                    resolve(body);

                } else reject(error) // Si une erreur est survenue, on rejette avec l'erreur

            }).on('error', (error) => {

                // Rejetter l'erreur
                reject(error);

            })

        });

    }

    /**
     * Parser les données distantes
     * @returns true; si le parsage à réussi, false sinon
     */
    public abstract parser(donneesRaw: string): boolean;

    /**
     * Extraire les données CSV
     */
    public extraireCSV<D>(donneesRaw: string, separator = ','): D {
        
        let parsed: D = {} as D;
        let donneesLignes = donneesRaw.split('\n');

        if (donneesLignes.length === 0) return parsed;

        // Entêtes CSV
        let entetes: string[] = [];
        donneesLignes.shift()!.replace('\r', '').split(separator).forEach((entete => {
            if(entete.charCodeAt(0) === 65279) entete = entete.slice(1);
            (parsed as any)[entete] = [];
            entetes.push(entete);
        }));

        // Corps CSV
        donneesLignes.forEach((ligne) => {
            ligne.replace('\r', '').split(separator).forEach((clef, i) => {
                (parsed as any)[entetes[i]].push(clef);
            });
        });

        return parsed;

    }

    /**
     * Extraire les données KML
     */
    public extraireKML(donneesRaw: string): FeatureCollection<Geometry | null, GeoJsonProperties> {

        const document = new DOMParser().parseFromString(donneesRaw);
        return kml(document);

    }

    /**
     * Extraire les données JSON
     */
    public extraireJSON<D>(donneesRaw: string): D {

        return JSON.parse(donneesRaw);
        
    }

}
