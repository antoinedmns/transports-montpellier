import { Methodes } from "../struct/express/Methodes";
import RouteAbstract from "../struct/express/RouteAbstract";
import { Request, Response } from "express";

export default class Index extends RouteAbstract {

    public chemin = '/';
    public methode: Methodes = 'get';

    public execution(req: Request, res: Response): void {

        res.render('contexte/cadre', {
            contenu: 'test'
        });

    }

}