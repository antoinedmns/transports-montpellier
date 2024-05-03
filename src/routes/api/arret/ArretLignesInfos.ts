import { Request, Response } from "express";
import RouteAbstract from "../../../struct/express/RouteAbstract";
import { Methodes } from "../../../struct/express/Methodes";
import ArretManager from "../../../struct/api_distante/reseau/ArretManager";
import LignesManager from "../../../struct/cache/lignes/LignesManager";

export default class ArretsLignesInfo extends RouteAbstract {

    public chemin = '/api/arret/:arret/lignes';
    public methode: Methodes = 'get';

    public execution(req: Request, res: Response): void {

        // récupérer l'arrêt
        const arret = ArretManager.cacheID.get(parseInt(req.params.arret));
        if (!arret) {
            res.status(404).json({ erreur: 'L\'id de l\'arrêt donné n\'a pas été trouvé' });
            return;
        }

        const arretLignes: ArretLigneInfo[] = [];
        for (const ligneNum of arret.ligneAssociees) {

            const ligne = LignesManager.tramway.cache.get(ligneNum)
                ?? LignesManager.bus.cache.get(ligneNum);

            if (!ligne) continue;

            arretLignes.push({
                numero: ligne.numExploitation,
                couleur: ligne.couleur,
                directions: arret.directions[ligne.numExploitation],
            })

        }


        res.json(
            arretLignes
        );

    }

}

export interface ArretLigneInfo {
    numero: string,
    couleur: string,
    directions: string[]
}