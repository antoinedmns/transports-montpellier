import request from 'request';
import Logger from '../internal/Logger';

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

        return await new Promise((resolve, reject) => {
        
            request.get(this.cheminDistant, (error, response, body) => {

                // Si les données distantes ont été récupérées, on résout avec le corps de la requête
                if (!error && response.statusCode == 200) resolve(body)
                else reject(error) // Si une erreur est survenue, on rejette avec l'erreur

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

}