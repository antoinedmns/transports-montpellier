import request from 'request';
import ApiEndpointAbstract from './ApiEndpointAbstract';
import unzipper from 'unzipper';

export default abstract class ApiEndpointZip extends ApiEndpointAbstract<string> {
    
    /**
     * Récupérer les données du fichier distant à l'adresse donnée dans la propriété 'cheminDistant".
     * @returns Le contenu du fichier distant, au format texte
     */
    public async recupererDonnees(): Promise<string> {

        const response = await fetch(this.cheminDistant);
        const buffer = Buffer.from(await response.arrayBuffer());
        // const directory = await unzipper.Open.buffer(buffer).catch(console.error);
        // console.log(directory);

        // const file = directory.files.find(d => d.path === 'tl_2015_us_zcta510.shp.iso.xml');
        // const content = await file.buffer();
        // console.log(content.toString());

        return 'pl';
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

}
