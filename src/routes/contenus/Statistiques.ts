import { Methodes } from "../../struct/express/Methodes";
import RouteAbstract from "../../struct/express/RouteAbstract";
import { Request, Response } from "express";

export default class Statistiques extends RouteAbstract {

    public chemin = '/contenus/statistiques';
    public methode: Methodes = 'get';

    public execution(req: Request, res: Response): void {

        res.render('contenus/statistiques');

    }

}