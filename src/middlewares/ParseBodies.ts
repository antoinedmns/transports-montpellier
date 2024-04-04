import express, { NextFunction } from "express"
import MiddlewareAbstract from "../struct/express/MiddlewareAbstract"

export default class ParseBodies extends MiddlewareAbstract {
    
    public execution(req: express.Request, res: express.Response, next: NextFunction): void {

        express.json({
            verify: (req, res, buf) => {

                // Try parsing buf as JSON
                try { (req as any).body = JSON.parse(buf.toString()); }

                // If body cannot be parsed, return '400: Bad Request' error
                catch (e) {
                    (res as express.Response).json({ status: 400, message: "Bad Request" });
                }

            }
        });

    }

}