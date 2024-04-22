import express from 'express';
import dotenv from 'dotenv';
import { join } from 'path';
import { AppEtats } from './struct/enums/app';
import Logger from './struct/internal/Logger';
import fs from 'fs';
import RouteAbstract from './struct/express/RouteAbstract';
import MiddlewareAbstract from './struct/express/MiddlewareAbstract';
import ApiLigneTram from './struct/api_distante/reseau/ApiLignesTram';
import LignesManager from './struct/cache/lignes/LignesManager';
import ApiLigneBus from './struct/api_distante/reseau/ApiLignesBus';

export default class Application {

    /**
     * Application Transports Montpellierains (3M)
     */
    constructor() {

        // Démarrage du serveur HTTP Express.js
        this.serveur = express()

        // Configuration express.js
		this.serveur.set('view engine', 'ejs');
		this.serveur.set('views', join(__dirname, '..', 'src', 'vues'));

        // Repertoire statique
        this.serveur.use(express.static(join(__dirname, '..', 'statique')));

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
    private async _init() {

        Logger.log.init();

        // Charger les variables d'environnement du fichier .env
        this._config();

        // Si l'application est déjà initialisée
        if (this.etatApp !== AppEtats.PREPARATION_DEMARRAGE)
            Logger.log.warn('AppInit', 'Tentative de redémarrage de l\'application ', 'annulée', ' : déjà initialisée.')

        // Charger et lier les routes HTTP
        this._loadRoutes();

        // Charger et lier les middlewares
        this._loadMiddlewares();

        // Charger et récupérer les données des lignes
        await (new ApiLigneTram().recuperer());
        await (new ApiLigneBus().recuperer());

        // Générer les ressources
        this._genererRessources();

        // Ecouter sur le port configuré dans le fichier .env
        this.serveur.listen(process.env.PORT, async () => {

            Logger.log.separator();
            Logger.log.debug('Serveur', 'Serveur HTTP démarré sur le port ', process.env.PORT);
            Logger.log.debug('Serveur', 'Vous pouvez accéder à l\'application via ', 'http://localhost:' + process.env.PORT);
            Logger.log.separator();
            this.etatApp = AppEtats.FONCTIONNELLE;

        });

    }

    /**
     * Charger les variables d'environnement du fichier .env
     */
    private _config() {

        const result = dotenv.config({ path: join(__dirname, '..', '.env') });

        if (result.error) {

            Logger.log.error('AppInit', 'Veuillez renommer le fichier ', 'exemple.env', ' en ', '.env', ' puis configurez-le.');
            process.exit(1);

        }

        Logger.log.success('Config', 'Chargement du fichier .env ... ', 'OK!');

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

                    Logger.log.error('Routeur', 'La route ',
                        routePath.replace(__dirname, '').replace('js', 'ts'),
                        ' n\'a pas pu être chargée car elle n\'étend pas la classe abstraite RouteAbstract.'
                    );
                    
                    continue;

                }

                // On créé une nouvelle instance de la route
                const instanceRoute = new ConstructeurRoute() as RouteAbstract;

                // On lie la route au serveur HTTP
                this.serveur[instanceRoute.methode](instanceRoute.chemin, instanceRoute.execution);

            }

            Logger.log.success('Routeur', 'Chargement de ', routes.length, ' routes en ', (Date.now() - tempsDebut) + 'ms','... ', 'OK!');
			resolve(true);

		});

	}

    /**
     * Charger les middlewares
	 */
	_loadMiddlewares = () => {

		return new Promise((resolve) => {

			let tempsDebut = Date.now();

			// Récupérer tous les middlewares du repertoire /src/middlewares
			const middlewares = fs.readdirSync(join(__dirname, 'middlewares'))
				.filter(file => file.endsWith('.js')) // Ne garder que les fichiers en .js
				.sort(); // Trier dans l'ordre alphabétique

			for (const middleware of middlewares) {

                // Récupérer l'élement exporté par défaut dans le fichier middleware
                const ConstructeurMiddleware = require(join(__dirname, 'middlewares', middleware)).default;

                // Vérifier que la classe exportée étend la classe abstraite MiddlewareAbstract
                if (!ConstructeurMiddleware || !(ConstructeurMiddleware.prototype instanceof MiddlewareAbstract)) {

                    Logger.log.error('Middlwre', 'Le middleware ', middleware, ' n\'a pas pu être chargée car il n\'étend pas la classe abstraite MiddlewareAbstract.');
                    continue;

                }

                // On créé une nouvelle instance du middleware
                const instanceMiddleware = new ConstructeurMiddleware() as MiddlewareAbstract;

                // On lie le middleware au serveur HTTP
                this.serveur.use(instanceMiddleware.execution);

			}

            Logger.log.success('Middlewares', 'Chargement de ', middlewares.length, ' middlewares en ', (Date.now() - tempsDebut) + 'ms','... ', 'OK!');
			resolve(true);

		});

    }

    /**
     * Générer les ressources statiques du serveur
     */
    private async _genererRessources() {

        // Générer le code CSS des indicateurs couleur de lignes
        fs.writeFile(join(__dirname, '..', 'statique', 'css', 'ressources', 'indicateur_lignes.css'), LignesManager.genererCSS(), function (err) {
            if (err) throw err;
            Logger.log.success('Ressources', 'Génération du fichier ', 'indicateur_lignes.css', '... ', 'OK!');
        }); 

    }

}