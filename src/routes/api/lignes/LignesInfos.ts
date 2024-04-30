import { Request, Response } from "express";
import RouteAbstract from "../../../struct/express/RouteAbstract";
import { Methodes } from "../../../struct/express/Methodes";
import LignesManager from "../../../struct/cache/lignes/LignesManager";
import { ReseauBus } from "../../../struct/cache/lignes/LigneBus";

export default class LignesInfo extends RouteAbstract {

    public chemin = '/api/lignes/infos';
    public methode: Methodes = 'get';

    public execution(req: Request, res: Response): void {

        const [tram, urbain, suburbain]: string[][] = [[], [], []];

        for (const ligneTram of LignesManager.tramway.cache.values()) {
            tram.push(ligneTram.numExploitation);
        }

        for (const ligneBus of LignesManager.bus.cache.values()) {
            if (ligneBus.reseau === ReseauBus.Urbain)
                urbain.push(ligneBus.numExploitation);
            else
                suburbain.push(ligneBus.numExploitation);
        }

        res.json(
            {
                tram: tram,
                urbain: urbain,
                suburbain: suburbain
            }
        );

    }

}
