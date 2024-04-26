import LignesManager from "../../struct/cache/lignes/LignesManager";
import { Methodes } from "../../struct/express/Methodes";
import RouteAbstract from "../../struct/express/RouteAbstract";
import { Request, Response } from "express";

export default class Test extends RouteAbstract {

    public chemin = '/api/traces-reseau';
    public methode: Methodes = 'get';

    public execution(req: Request, res: Response): void {

        const resultat: traceLigne[] = [];

        for (const ligneTram of LignesManager.tramway.cache.values()) {
            resultat.push({
                num: ligneTram.numExploitation,
                couleur: ligneTram.couleur,
                coordonnees: ligneTram.traces
            })
        }

        for (const ligneBus of LignesManager.bus.cache.values()) {
            resultat.push({
                num: ligneBus.numExploitation,
                couleur: ligneBus.couleur,
                coordonnees: ligneBus.traces
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