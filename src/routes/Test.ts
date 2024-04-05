import { Methodes } from "../struct/express/Methodes";
import RouteAbstract from "../struct/express/RouteAbstract";
import { Request, Response } from "express";

export default class Test extends RouteAbstract {

    public chemin = '/test';
    public methode: Methodes = 'get';

    public execution(req: Request, res: Response): void {

        res.render('test');

    }

}