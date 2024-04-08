import express from "express"
import MiddlewareAbstract from "../struct/express/MiddlewareAbstract"
import { join } from "path"

export default class RepertoireStatique extends MiddlewareAbstract {
    
    public static readonly CHEMIN_REPERTOIRE = join(__dirname, '..', 'static');

    public execution(): void {

        express.static(RepertoireStatique.CHEMIN_REPERTOIRE)

    }

}