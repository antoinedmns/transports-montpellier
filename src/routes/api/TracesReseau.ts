import LignesManager from "../../struct/cache/lignes/LignesManager";
import { Methodes } from "../../struct/express/Methodes";
import RouteAbstract from "../../struct/express/RouteAbstract";
import { Request, Response } from "express";

export default class Test extends RouteAbstract {

    public chemin = '/api/traces-reseau';
    public methode: Methodes = 'get';

    public execution(req: Request, res: Response): void {

        const resultat: traceLigne[] = [];

        for (const ligne of LignesManager.cache.values()) {
            resultat.push({
                num: ligne.numExploitation,
                couleur: ligne.couleur,
                coordonnees: ligne.traces
            })
        }

        res.json(
            resultat
        );

    }

}

interface traceLigne {
    num: string,
    couleur: string
    coordonnees: number[][][]
}