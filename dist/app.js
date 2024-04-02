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
class Application {
    constructor() {
        this.serveur = (0, express_1.default)();
        this.serveur.set('view engine', 'ejs');
        this.serveur.set('views', (0, path_1.join)(__dirname, 'src', 'vues'));
    }
    serveur;
    etatApp = app_1.AppEtats.PREPARATION_DEMARRAGE;
    _init() {
        if (this.etatApp !== app_1.AppEtats.PREPARATION_DEMARRAGE)
            Logger_1.default.log.warn('AppInit', 'Tentative de redémarrage de l\'application ', 'annulée', ' : déjà initialisée.');
    }
    _loadRoutes = () => {
        return new Promise((resolve) => {
            let routes = [];
            const getAllFiles = (dir) => fs_1.default.readdirSync(dir).forEach((fichier, i) => {
                const cheminFichier = (0, path_1.join)(dir, fichier);
                if (fs_1.default.statSync(cheminFichier).isDirectory())
                    getAllFiles(cheminFichier);
                else
                    routes.push(cheminFichier);
            });
            routes.forEach(routePath => {
                const routeFile = require(routePath);
            });
            getAllFiles((0, path_1.join)(__dirname, 'src', 'routes')).forEach(routePath => {
                const routeFile = require(routePath);
                this[routeFile.data.method](routeFile.data.path, (req, res) => routeFile.route(this, req, res));
            });
            logger.log("Routes", "Loaded ", routes.length, " routes in ", (new Date() - startTime).toString() + "ms", "... ", "OK!");
            resolve();
        });
    };
}
