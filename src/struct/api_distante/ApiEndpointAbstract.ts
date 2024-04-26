import request from 'request';
import Logger from '../internal/Logger';
import { kml } from "@tmcw/togeojson";
import { DOMParser } from 'xmldom';
import type { Geometry, FeatureCollection, GeoJsonProperties } from 'geojson';

export default abstract class ApiEndpointAbstract {

    /**
     * Chemin distant vers le fichier à télécharger
     */
    public abstract cheminDistant: string;

    /**
     * Nom de l'endpoint à récupérer, utilisé pour le débuggage principalement
     */
    public abstract nom: string;
    
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
     * Récupérer et parser les données distantes
     */
    public async recuperer() {

        // Récupération des données
        const donnees = await this.recupererDonnees()
            .catch((erreur) => Logger.log.error('Api', 'Erreur lors de la récupération des données pour ', this.nom, '. Erreur : ', erreur));

        // Parsage des données
        if (donnees) this.parser(donnees);

    }

    /**
     * Parser les données distantes
     * @returns true; si le parsage à réussi, false sinon
     */
    public abstract parser(donneesRaw: string): boolean;

    /**
     * Extraire les données CSV
     */
    public extraireCSV<D>(donneesRaw: string): D {
        
        let parsed: D = {} as D;
        let donneesLignes = donneesRaw.split('\n');

        if (donneesLignes.length === 0) return parsed;

        // Entêtes CSV
        let entetes: string[] = [];
        donneesLignes.shift()!.replace('\r', '').split(',').forEach((entete => {
            if(entete.charCodeAt(0) === 65279) entete = entete.slice(1);
            (parsed as any)[entete] = [];
            entetes.push(entete);
        }));

        // Corps CSV
        donneesLignes.forEach((ligne) => {
            ligne.replace('\r', '').split(',').forEach((clef, i) => {
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