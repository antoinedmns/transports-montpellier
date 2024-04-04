"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const app_1 = require("./struct/enums/app");
const Logger_1 = __importDefault(require("./struct/internal/Logger"));
const fs_1 = __importDefault(require("fs"));
const RouteAbstract_1 = __importDefault(require("./struct/express/RouteAbstract"));
const MiddlewareAbstract_1 = __importDefault(require("./struct/express/MiddlewareAbstract"));
class Application {
    constructor() {
        this.serveur = (0, express_1.default)();
        console.log('s');
        this.serveur.set('view engine', 'ejs');
        this.serveur.set('views', (0, path_1.join)(__dirname, 'src', 'vues'));
        this._init();
    }
    serveur;
    etatApp = app_1.AppEtats.PREPARATION_DEMARRAGE;
    _init() {
        if (this.etatApp !== app_1.AppEtats.PREPARATION_DEMARRAGE)
            Logger_1.default.log.warn('AppInit', 'Tentative de redémarrage de l\'application ', 'annulée', ' : déjà initialisée.');
        this._loadRoutes();
    }
    _loadRoutes = () => {
        return new Promise((resolve) => {
            const tempsDebut = Date.now();
            let routes = [];
            const getAllFiles = (dir) => fs_1.default.readdirSync(dir).forEach((fichier, i) => {
                const cheminFichier = (0, path_1.join)(dir, fichier);
                if (fs_1.default.statSync(cheminFichier).isDirectory())
                    getAllFiles(cheminFichier);
                else
                    routes.push(cheminFichier);
            });
            getAllFiles((0, path_1.join)(__dirname, 'routes'));
            for (const routePath of routes) {
                const ConstructeurRoute = require(routePath).default;
                if (!ConstructeurRoute || !(ConstructeurRoute.prototype instanceof RouteAbstract_1.default)) {
                    Logger_1.default.log.error('Routeur', 'La route ', routePath, ' n\'a pas pu être chargée car elle n\'étend pas la classe abstraite RouteAbstract.');
                    continue;
                }
                const instanceRoute = new ConstructeurRoute();
                this.serveur[instanceRoute.methode](instanceRoute.chemin, instanceRoute.execution);
            }
            Logger_1.default.log.info('Routeur', 'Chargement de ', routes.length, ' routes en ', (Date.now() - tempsDebut) + 'ms', ' ... ', 'OK!');
            resolve(true);
        });
    };
    _loadMiddlewares = () => {
        return new Promise((resolve) => {
            let tempsDebut = new Date();
            const middlewares = fs_1.default.readdirSync((0, path_1.join)(__dirname, 'middlewares'))
                .filter(file => file.endsWith('.js'))
                .sort();
            middlewares.forEach(middleware => {
                const ConstructeurMiddleware = require((0, path_1.join)(__dirname, 'middlewares', middleware)).default;
                if (!ConstructeurMiddleware || !(ConstructeurMiddleware.prototype instanceof MiddlewareAbstract_1.default)) {
                    Logger_1.default.log.error('Middlwre', 'Le middleware ', middleware, ' n\'a pas pu être chargée car elle n\'étend pas la classe abstraite RouteAbstract.');
                    continue;
                }
                const instanceRoute = new ConstructeurMiddleware();
                this.serveur[instanceRoute.methode](instanceRoute.chemin, instanceRoute.execution);
            });
            Logger_1.default.log.info('Routeur', 'Chargement de ', routes.length, ' routes en ', (Date.now() - tempsDebut) + 'ms', ' ... ', 'OK!');
            resolve(true);
        });
    };
}
exports.default = Application;
