import LigneTramway from "../../cache/lignes/LigneTramway";
import LignesManager from "../../cache/lignes/LignesManager";
import ApiEndpointAbstract from "../ApiEndpointAbstract";

export default class ApiLigneTram extends ApiEndpointAbstract {

    public cheminDistant = 'https://data.montpellier3m.fr/node/12889/download';
    public nom = 'Lignes tram'; 

    public parser(donneesRaw: string) {

        const csv = this.extraireCSV<CsvApiLigneTram>(donneesRaw);
        
        for (let i = 0; i < csv.code_couleur.length; i++) {

            const numExploitation = csv.num_exploitation[i];

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