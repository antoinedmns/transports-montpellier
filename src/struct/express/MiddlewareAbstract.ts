import { NextFunction } from "express";

export default abstract class MiddlewareAbstract {
    
    /**
     * Appellé pour chaque requête HTTP passée au serveur
     * @param req Données de la requête HTTP
     * @param res Réponse renvoyée par le serveur
     * @param next Middleware suivant (doit être appellé pour poursuivre l'exécution)
     */
    public abstract execution(req: Express.Request, res: Express.Response, next: NextFunction): void;

}

type methodes = 'get' | 'post' | 'patch' | 'put' | 'delete';