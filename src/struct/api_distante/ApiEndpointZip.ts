import request from 'request';
import ApiEndpointAbstract from './ApiEndpointAbstract';
import unzipper from 'unzipper';
import { ClientRequest } from 'http';

export default abstract class ApiEndpointZip extends ApiEndpointAbstract<Record<string, FileInfo>> {
    
    /**
     * Récupérer les données du fichier distant à l'adresse donnée dans la propriété 'cheminDistant".
     * @returns Le contenu du fichier distant, au format texte
     */
    public async recupererDonnees(): Promise<Record<string, FileInfo>> {

        const response = await fetch(this.cheminDistant);
        const buffer = Buffer.from(await response.arrayBuffer());
        const directory = await unzipper.Open.buffer(buffer);

        const fichiers: Record<string, FileInfo> = {};
        for (const f of directory.files) {
            fichiers[f.path] = f;
        }

        return fichiers;
    }

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

export interface FileInfo {
    buffer: () => Promise<Buffer>
    path: string
}