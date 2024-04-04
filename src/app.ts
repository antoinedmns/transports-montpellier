import express from 'express';
import dotenv from 'dotenv';
import { join } from 'path';
import { AppEtats } from './struct/enums/app';
import Logger from './struct/internal/Logger';
import fs from 'fs';
import RouteAbstract from './struct/express/RouteAbstract';
import MiddlewareAbstract from './struct/express/MiddlewareAbstract';

export default class Application {

    /**
     * Application Transports Montpellierains
     */
    constructor() {

        // Démarrage du serveur HTTP Express.js
        this.serveur = express()

        console.log('s')

        // Configuration express.js
		this.serveur.set('view engine', 'ejs');
		this.serveur.set('views', join(__dirname, 'src', 'vues')); // Path to views

        // Initialiser l'application
        this._init();

    }

    /**
     * Serveur HTTP Express.js
     */
    public serveur: express.Express;

    /**
     * Etat de l'application
     */
    public etatApp: AppEtats = AppEtats.PREPARATION_DEMARRAGE;

    /**
     * Init app
     */
    private _init() {

        // Si l'application est déjà initialisée
        if (this.etatApp !== AppEtats.PREPARATION_DEMARRAGE) Logger.log.warn('AppInit', 'Tentative de redémarrage de l\'application ', 'annulée', ' : déjà initialisée.')

        // Charger et lier les routes HTTP
        this._loadRoutes();

    }

    /**
     * Charger les ROUTES HTTP
     * @returns 
     */
    _loadRoutes =  () => {

		return new Promise((resolve) => {

            const tempsDebut = Date.now();
            let routes: string[] = []

			// Ajouter récursivement tous les fichiers du dossier /src/routes/ dans la liste 'routes'
			const getAllFiles = (dir: string): void =>

                fs.readdirSync(dir).forEach((fichier, i) => {
                    
                    // Récupérer le chemin du fichier
                    const cheminFichier = join(dir, fichier);

                    // Si le fichier est un répertoire, récursion
                    if(fs.statSync(cheminFichier).isDirectory())
                        getAllFiles(cheminFichier);

                    // Sinon; on l'ajoute à la liste des routes chargées
                    else routes.push(cheminFichier);
                    
                });

            getAllFiles(join(__dirname, 'routes'));

            // Pour chaque route
            for (const routePath of routes) {

                // Récupérer l'élement exporté par défaut dans le fichier route
                const ConstructeurRoute = require(routePath).default;

                // Vérifier que la classe exportée étend la classe abstraite RouteAbstract
                if (!ConstructeurRoute || !(ConstructeurRoute.prototype instanceof RouteAbstract)) {

                    Logger.log.error('Routeur', 'La route ', routePath, ' n\'a pas pu être chargée car elle n\'étend pas la classe abstraite RouteAbstract.');
                    continue;

                }

                // On créé une nouvelle instance de la route
                const instanceRoute = new ConstructeurRoute() as RouteAbstract;

                // On lie la route au serveur HTTP
                this.serveur[instanceRoute.methode](instanceRoute.chemin, instanceRoute.execution);

            }

            Logger.log.info('Routeur', 'Chargement de ', routes.length, ' routes en ', (Date.now() - tempsDebut) + 'ms',' ... ', 'OK!');
			resolve(true);

		});

	}

    /**
     * Charger les middlewares
	 */
	_loadMiddlewares = () => {

		return new Promise((resolve) => {

			let tempsDebut = new Date();

			// Récupérer tous les middlewares du repertoire /src/middlewares
			const middlewares = fs.readdirSync(join(__dirname, 'middlewares'))
				.filter(file => file.endsWith('.js')) // Ne garder que les fichiers en .js
				.sort(); // Trier dans l'ordre alphabétique

			middlewares.forEach(middleware => {

                // Récupérer l'élement exporté par défaut dans le fichier middleware
                const ConstructeurMiddleware = require(join(__dirname, 'middlewares', middleware)).default;

                // Vérifier que la classe exportée étend la classe abstraite MiddlewareAbstract
                if (!ConstructeurMiddleware || !(ConstructeurMiddleware.prototype instanceof MiddlewareAbstract)) {

                    Logger.log.error('Middlwre', 'Le middleware ', middleware, ' n\'a pas pu être chargée car elle n\'étend pas la classe abstraite RouteAbstract.');
                    continue;

                }

                // On créé une nouvelle instance de la route
                const instanceRoute = new ConstructeurMiddleware() as RouteAbstract;

                // On lie la route au serveur HTTP
                this.serveur[instanceRoute.methode](instanceRoute.chemin, instanceRoute.execution);


			});

            Logger.log.info('Routeur', 'Chargement de ', routes.length, ' routes en ', (Date.now() - tempsDebut) + 'ms',' ... ', 'OK!');
			resolve(true);

		});

}