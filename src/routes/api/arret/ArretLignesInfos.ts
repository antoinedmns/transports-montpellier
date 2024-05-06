import { Request, Response } from "express";
import RouteAbstract from "../../../struct/express/RouteAbstract";
import { Methodes } from "../../../struct/express/Methodes";
import ArretManager from "../../../struct/cache/arrets/ArretManager";
import LignesManager from "../../../struct/cache/lignes/LignesManager";

export default class ArretsLignesInfo extends RouteAbstract {

    public chemin = '/api/arret/:arret/lignes';
    public methode: Methodes = 'get';

    public execution(req: Request, res: Response): void {

        // récupérer l'arrêt
        const arret = ArretManager.cacheId.get(req.params.arret);
        if (!arret) {
            res.status(404).json({ erreur: 'L\'id de l\'arrêt donné n\'a pas été trouvé' });
            return;
        }

        const arretLignes: ArretLigneInfo[] = [];
        for (const ligneNum of arret.lignes) {

            const ligne = LignesManager.cacheNum.get(ligneNum);

            if (!ligne) continue;

            const now = Date.now();

            const passagesLigne = arret.passages[ligne.numExploitation];
            const prochainsPassages: Record<string, { headsign: string, timestamp: number }> = {}; // direction -> timestamp

            if (passagesLigne) {

                // pour chaque direction, récupérer
                for (const direction in passagesLigne) {

                    const passagesDirection = passagesLigne[direction];
                    let prochainPassageId: string | null = null;
                    let prochainPassageTimestamp: number | null = null;

                    // pour chaque trajet, récupérer le prochain passage
                    for (const trajet in passagesDirection) {

                        const passage = passagesDirection[trajet];
                        if ((!prochainPassageTimestamp || passage.departure?.time < prochainPassageTimestamp) && (passage.departure?.time * 1000 > now)) {
                            prochainPassageId = trajet;
                            prochainPassageTimestamp = passage.departure?.time;
                        }

                    }

                    prochainsPassages[direction] = prochainPassageId ? {
                        headsign: ligne.trajets[prochainPassageId] || 'Incertain',
                        timestamp: prochainPassageTimestamp || 0
                    } : { headsign: 'DIRECTION ' + direction, timestamp: 0 };

                }

            }

            arretLignes.push({
                numero: ligne.numExploitation,
                couleur: ligne.couleur,
                directions: ['test', 'test'],
                prochains_passages: prochainsPassages
            });

        }


        res.json(
            arretLignes
        );

    }

}

export interface ArretLigneInfo {
    numero: string,
    couleur: string,
    directions: string[],
    prochains_passages: Record<string, {
        headsign: string,
        timestamp: number
    }>
}