import { Methodes } from "../../struct/express/Methodes";
import RouteAbstract from "../../struct/express/RouteAbstract";
import { Request, Response } from "express";

export default class Carte extends RouteAbstract {

    public chemin = '/contenus/carte';
    public methode: Methodes = 'get';

    public execution(req: Request, res: Response): void {

        res.render('contenus/carte');

    }

}