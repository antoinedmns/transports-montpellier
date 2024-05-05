import { Request, Response } from "express";
import LignesManager from "../../../struct/cache/lignes/LignesManager";
import { Methodes } from "../../../struct/express/Methodes";
import RouteAbstract from "../../../struct/express/RouteAbstract";
import ArretManager from "../../../struct/cache/arrets/ArretManager";

export default class ArretInfos extends RouteAbstract {

    public chemin = '/api/ligne/:ligne/arret/:arret/infos';
    public methode: Methodes = 'get';

    public execution(req: Request, res: Response): void {

        // récupérer la ligne
        const ligne = LignesManager.tramway.cache.get(req.params.ligne) ?? LignesManager.bus.cache.get(req.params.ligne);
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

        res.json(
            {
                ligne: {
                    couleur: ligne.couleur
                },
                arret: {
                    nom: arret.description,
                    // commune: arret.commune,
                    coordonnees: arret.coordonnees,
                    // lignes: arret.ligneAssociees,
                    directions: arret.directions[ligne.numExploitation]
                }
            }
        );

    }

}