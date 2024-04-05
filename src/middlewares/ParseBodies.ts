import express, { NextFunction } from "express"
import MiddlewareAbstract from "../struct/express/MiddlewareAbstract"

export default class ParseBodies extends MiddlewareAbstract {
    
    public execution(req: express.Request, res: express.Response, next: NextFunction): void {

        express.json({
            verify: (reqV, resV, bufV) => {

                // Parser le body en JSON
                try { req.body = JSON.parse(bufV.toString()); }

                // Si le body n'est pas du JSON, on renvoie une erreur
                catch (e) {
                    res.json({ status: 400, message: "Bad Request" });
                }

            }
        });

    }

}