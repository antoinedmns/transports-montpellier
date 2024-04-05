import { Methodes } from "./Methodes";

export default abstract class RouteAbstract {

    /**
     * Méthode HTTP d'accès à la page
     */
    public abstract methode: Methodes;
    
    /**
     * Chemin URL dynamique pour charger la route.
     * @example /test/:id/
     */
    public abstract chemin: string;

    /**
     * Appellé lorsque la route est demandée par un utilisateur distant.
     * @param req Données de la requête HTTP
     * @param res Réponse renvoyée par le serveur
     */
    public abstract execution(req: Express.Request, res: Express.Response): void;

}