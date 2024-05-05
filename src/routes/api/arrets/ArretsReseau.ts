import { Request, Response } from "express";
import RouteAbstract from "../../../struct/express/RouteAbstract";
import { Methodes } from "../../../struct/express/Methodes";
import ArretManager from "../../../struct/cache/arrets/ArretManager";

export default class Test extends RouteAbstract {

    public chemin = '/api/arrets/reseau';
    public methode: Methodes = 'get';

    public execution(req: Request, res: Response): void {

        res.json(
            ArretManager.parsed
        );

    }

}

export interface ArretInfo {
    id: number,
    coords: number[],
    nom: string,
    commune: string | null,
    lignes: string[]
}