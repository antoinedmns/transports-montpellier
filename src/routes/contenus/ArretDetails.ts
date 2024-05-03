import { Methodes } from "../../struct/express/Methodes";
import RouteAbstract from "../../struct/express/RouteAbstract";
import { Request, Response } from "express";

export default class Arrets extends RouteAbstract {

    public chemin = '/contenus/arret-details/:ligne/:arret';
    public methode: Methodes = 'get';

    public execution(req: Request, res: Response): void {

        // récupérer les paramètres de la requête
        const ligne = req.params.ligne;
        const arret = req.params.arret;

        res.render('contenus/arret-details', { ligne, arret });

    }

}