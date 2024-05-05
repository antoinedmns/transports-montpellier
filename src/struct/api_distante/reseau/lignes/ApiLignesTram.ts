import LigneTramway from "../../../cache/lignes/LigneTramway";
import LignesManager from "../../../cache/lignes/LignesManager";
import ApiEndpointHTTP from "../../ApiEndpointHTTP";

export default class ApiLignesTram extends ApiEndpointHTTP {

    public cheminDistant = 'https://data.montpellier3m.fr/node/12889/download';
    public nom = 'Lignes tram'; 

    public parser(donneesRaw: string) {

        const csv = this.extraireCSV<CsvApiLigneTram>(donneesRaw);
        
        for (let i = 0; i < csv.code_couleur.length; i++) {

            const numExploitation = ApiLignesTram.ligneFormatter(csv.num_exploitation[i]);

            // Instancier la ligne
            LignesManager.tramway.ajouter(
                new LigneTramway(
                    numExploitation,
                    numExploitation,
                    csv.code_couleur[i]
                )
            )

        }

        return true;

    }

    /**
     * Formatter une ligne pour la rendre compatible avec le format attendu par la TaM.
     * @param ligne 
     */
    static ligneFormatter(ligne: string) {
        return ligne.length === 1 ? '0' + ligne : ligne;
    }

}

interface CsvApiLigneTram {
    id_lignes_sens: string[]
    reseau: 'Urbain'[]
    mode: 'Tramway'[]
    nom_ligne: string[]
    num_exploitation: string[]
    sens: string[]
    fonctionnement: string[]
    code_couleur: string[]
}