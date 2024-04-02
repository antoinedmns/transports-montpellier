import express from 'express';
import dotenv from 'dotenv';
import { join } from 'path';
import { AppEtats } from './struct/enums/app';
import Logger from './struct/internal/Logger';
import fs from 'fs';

class Application {

    /**
     * Application Transports Montpellierains
     */
    constructor() {

        // Démarrage du serveur HTTP Express.js
        this.serveur = express()

        // Configuration express.js
		this.serveur.set('view engine', 'ejs');
		this.serveur.set('views', join(__dirname, 'src', 'vues')); // Path to views

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



    }

    /**
     * Charger les ROUTES HTTP
     * @returns 
     */
    _loadRoutes =  () => {

		return new Promise((resolve) => {

            let routes: string[] = []

			// Récupérer récursivement tous les fichiers dans le dossier /src/routes/
			const getAllFiles = (dir: string): void =>

                fs.readdirSync(dir).forEach((fichier, i) => {
                    
                    // Récupérer le chemin du fichier
                    const cheminFichier = join(dir, fichier);

                    // Si le fichier est un répertoire, récursion
                    if(fs.statSync(cheminFichier).isDirectory())
                        getAllFiles(cheminFichier);

                    // Sinon; on l'ajoute à la liste des routes chargées
                    else routes.push(cheminFichier);
                    
                })

            // Pour chaque route
            routes.forEach(routePath => {

                // Récupérer le contenu du fichier route
                const routeFile = require(routePath);

            });

			// For each route..
			getAllFiles(join(__dirname, 'src', 'routes')).forEach(routePath => {

				// Get route
				const routeFile = require(routePath);

				// Load route
				this[routeFile.data.method] // Add route to express.js depending on its method (GET, POST, etc)
					(routeFile.data.path, (req, res) => routeFile.route(this, req, res));

			});

			// Log
			logger.log("Routes", "Loaded ", routes.length, " routes in ", (new Date() - startTime).toString() + "ms", "... ", "OK!");

			// Résout la promesse
			resolve();

		});

	}

}