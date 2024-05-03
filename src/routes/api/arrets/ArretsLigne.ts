import { Request, Response } from "express";
import RouteAbstract from "../../../struct/express/RouteAbstract";
import { Methodes } from "../../../struct/express/Methodes";
import LignesManager from "../../../struct/cache/lignes/LignesManager";

export default class ArretsLigne extends RouteAbstract {

    public chemin = '/api/arrets/ligne/:ligne';
    public methode: Methodes = 'get';

    public execution(req: Request, res: Response): void {

        // récupérer la ligne
        const ligne = LignesManager.tramway.cache.get(req.params.ligne) ?? LignesManager.bus.cache.get(req.params.ligne);
        if (!ligne) {
            res.status(404).json({ erreur: 'Ligne non trouvée' });
            return;
        }

        const arretsObj: Record<string, Partial<ArretInfo>> = {};
        for (const arret of ligne.arrets.values()) {

            if (!arretsObj[arret.description]) {
                arretsObj[arret.description] = {
                    id: arret.id,
                    commune: arret.commune
                }
            }

        }

        res.json(
            arretsObj
        );

    }

}

export interface ArretInfo {
    id: number,
    coords: number[],
    nom: string,
    commune: string,
    lignes: string[]
}