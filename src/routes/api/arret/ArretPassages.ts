import { Request, Response } from "express";
import RouteAbstract from "../../../struct/express/RouteAbstract";
import { Methodes } from "../../../struct/express/Methodes";
import ArretManager from "../../../struct/api_distante/reseau/ArretManager";

export default class Test extends RouteAbstract {

    public chemin = '/api/arret/:id/passages';
    public methode: Methodes = 'get';

    public execution(req: Request, res: Response): void {

        res.json(
            ArretManager.parsed
        );

    }

}

export interface ArretInfo {
    coords: number[],
    nom: string,
    commune: string,
    lignes: string[]
}