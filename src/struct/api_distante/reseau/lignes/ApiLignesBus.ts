import LigneBus, { ReseauBus } from "../../../cache/lignes/LigneBus";
import LignesManager from "../../../cache/lignes/LignesManager";
import ApiEndpointHTTP from "../../ApiEndpointHTTP";

export default class ApiLigneBus extends ApiEndpointHTTP {

    public cheminDistant = 'https://data.montpellier3m.fr/node/13227/download';
    public nom = 'Lignes bus'; 

    public parser(donneesRaw: string) {

        const csv = this.extraireCSV<CsvApiLigneBus>(donneesRaw);
        
        for (let i = 0; i < csv.code_couleur.length; i++) {

            // formatage du numéro d'exploitation (padding d'un 0 devant le numéro si < 10)
            const numExploitation = ApiLigneBus.ligneFormatter(csv.num_exploitation[i]);

            // Instancier la ligne
            LignesManager.bus.ajouter(
                new LigneBus(
                    numExploitation,
                    numExploitation,
                    csv.code_couleur[i],
                    csv.reseau[i] === 'Urbain' ? ReseauBus.Urbain : ReseauBus.Suburbain
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

interface CsvApiLigneBus {
    id_lignes_sens: string[]
    reseau: 'Urbain' | 'Suburbain'[]
    mode: 'Bus'[]
    nom_ligne: string[]
    num_exploitation: string[]
    sens: string[]
    fonctionnement: string[]
    code_couleur: string[]
}