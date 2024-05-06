import { Request, Response } from "express";
import LignesManager from "../../../struct/cache/lignes/LignesManager";
import { Methodes } from "../../../struct/express/Methodes";
import RouteAbstract from "../../../struct/express/RouteAbstract";
import ArretManager from "../../../struct/cache/arrets/ArretManager";

export default class ArretPassages extends RouteAbstract {

    public chemin = '/api/ligne/:ligne/arret/:arret/passages';
    public methode: Methodes = 'get';

    public execution(req: Request, res: Response): void {

        // récupérer la ligne
        const ligne = LignesManager.cacheNum.get(req.params.ligne);
        if (!ligne) {
            res.status(404).json({ erreur: 'Ligne non trouvée' });
            return;
        }

        // récupérer l'arrêt
        const arret = ArretManager.cacheId.get(req.params.arret);
        if (!arret) {
            res.status(404).json({ erreur: 'L\'id de l\'arrêt donné n\'a pas été trouvé' });
            return;
        }

        const passages: Record<string, { headsign: string, time: number }[]> = {};
        for (const direction in arret.passages[ligne.numExploitation]) {

            passages[direction] = [];
            for (const [trajetId, passage] of Object.entries(arret.passages[ligne.numExploitation][direction])) {
                passages[direction].push({
                    headsign: ligne.trajets[trajetId] || 'Incertain',
                    time: passage.departure?.time
                });
            }


        }

        res.json(passages);

    }

}