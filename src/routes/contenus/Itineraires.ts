import { Methodes } from "../../struct/express/Methodes";
import RouteAbstract from "../../struct/express/RouteAbstract";
import { Request, Response } from "express";

export default class Itineraires extends RouteAbstract {

    public chemin = '/contenus/itineraires';
    public methode: Methodes = 'get';

    public execution(req: Request, res: Response): void {

        res.render('contenus/itineraires');

    }

}