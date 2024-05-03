"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = require("path");
const app_1 = require("./struct/enums/app");
const Logger_1 = __importDefault(require("./struct/internal/Logger"));
const fs_1 = __importDefault(require("fs"));
const RouteAbstract_1 = __importDefault(require("./struct/express/RouteAbstract"));
const MiddlewareAbstract_1 = __importDefault(require("./struct/express/MiddlewareAbstract"));
const ApiLignesTram_1 = __importDefault(require("./struct/api_distante/reseau/ApiLignesTram"));
const LignesManager_1 = __importDefault(require("./struct/cache/lignes/LignesManager"));
const ApiLignesBus_1 = __importDefault(require("./struct/api_distante/reseau/ApiLignesBus"));
const ApiTraceTram_1 = __importDefault(require("./struct/api_distante/reseau/ApiTraceTram"));
const ApiArretsTram_1 = __importDefault(require("./struct/api_distante/reseau/arrets/ApiArretsTram"));
const ApiArretsBus_1 = __importDefault(require("./struct/api_distante/reseau/arrets/ApiArretsBus"));
const ApiTraceBus_1 = __importDefault(require("./struct/api_distante/reseau/ApiTraceBus"));
const ApiTripUpdate_1 = __importDefault(require("./struct/api_distante/temps_reel/ApiTripUpdate"));
const ApiReseauGTFS_1 = __importDefault(require("./struct/api_distante/reseau/ApiReseauGTFS"));
const ApiTempsReel_1 = __importDefault(require("./struct/api_distante/reseau/ApiTempsReel"));
const ApiAlertesGTFS_1 = __importDefault(require("./struct/api_distante/temps_reel/ApiAlertesGTFS"));
class Application {
    constructor() {
        this.serveur = (0, express_1.default)();
        this.serveur.set('view engine', 'ejs');
        this.serveur.set('views', (0, path_1.join)(__dirname, '..', 'src', 'vues'));
        this.serveur.use(express_1.default.static((0, path_1.join)(__dirname, '..', 'statique')));
        this._init();
    }
    serveur;
    etatApp = app_1.AppEtats.PREPARATION_DEMARRAGE;
    async _init() {
        Logger_1.default.log.init();
        this._config();
        if (this.etatApp !== app_1.AppEtats.PREPARATION_DEMARRAGE)
            Logger_1.default.log.warn('AppInit', 'Tentative de redémarrage de l\'application ', 'annulée', ' : déjà initialisée.');
        this._loadRoutes();
        this._loadMiddlewares();
        await (new ApiTripUpdate_1.default().recuperer());
        await (new ApiReseauGTFS_1.default().recuperer());
        await (new ApiLignesTram_1.default().recuperer());
        await (new ApiLignesBus_1.default().recuperer());
        await (new ApiTraceTram_1.default().recuperer());
        await (new ApiTraceBus_1.default().recuperer());
        await (new ApiArretsTram_1.default().recuperer());
        await (new ApiArretsBus_1.default().recuperer());
        await (new ApiTempsReel_1.default().recuperer());
        await (new ApiAlertesGTFS_1.default().recuperer());
        this._genererRessources();
        this.serveur.listen(process.env.PORT, async () => {
            Logger_1.default.log.separator();
            Logger_1.default.log.debug('Serveur', 'Serveur HTTP démarré sur le port ', process.env.PORT);
            Logger_1.default.log.debug('Serveur', 'Vous pouvez accéder à l\'application via ', 'http://localhost:' + process.env.PORT);
            Logger_1.default.log.separator();
            this.etatApp = app_1.AppEtats.FONCTIONNELLE;
        });
    }
    _config() {
        const result = dotenv_1.default.config({ path: (0, path_1.join)(__dirname, '..', '.env') });
        if (result.error) {
            Logger_1.default.log.error('AppInit', 'Veuillez renommer le fichier ', 'exemple.env', ' en ', '.env', ' puis configurez-le.');
            process.exit(1);
        }
        Logger_1.default.log.success('Config', 'Chargement du fichier .env ... ', 'OK!');
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
                    Logger_1.default.log.error('Routeur', 'La route ', routePath.replace(__dirname, '').replace('js', 'ts'), ' n\'a pas pu être chargée car elle n\'étend pas la classe abstraite RouteAbstract.');
                    continue;
                }
                const instanceRoute = new ConstructeurRoute();
                this.serveur[instanceRoute.methode](instanceRoute.chemin, instanceRoute.execution);
            }
            this.serveur.all('*', function (req, res) {
                res.status(404).json({ erreur: 'Ressource non trouvée' });
            });
            Logger_1.default.log.success('Routeur', 'Chargement de ', routes.length, ' routes en ', (Date.now() - tempsDebut) + 'ms', '... ', 'OK!');
            resolve(true);
        });
    };
    _loadMiddlewares = () => {
        return new Promise((resolve) => {
            let tempsDebut = Date.now();
            const middlewares = fs_1.default.readdirSync((0, path_1.join)(__dirname, 'middlewares'))
                .filter(file => file.endsWith('.js'))
                .sort();
            for (const middleware of middlewares) {
                const ConstructeurMiddleware = require((0, path_1.join)(__dirname, 'middlewares', middleware)).default;
                if (!ConstructeurMiddleware || !(ConstructeurMiddleware.prototype instanceof MiddlewareAbstract_1.default)) {
                    Logger_1.default.log.error('Middlwre', 'Le middleware ', middleware, ' n\'a pas pu être chargée car il n\'étend pas la classe abstraite MiddlewareAbstract.');
                    continue;
                }
                const instanceMiddleware = new ConstructeurMiddleware();
                this.serveur.use(instanceMiddleware.execution);
            }
            Logger_1.default.log.success('Middlewares', 'Chargement de ', middlewares.length, ' middlewares en ', (Date.now() - tempsDebut) + 'ms', '... ', 'OK!');
            resolve(true);
        });
    };
    async _genererRessources() {
        fs_1.default.writeFile((0, path_1.join)(__dirname, '..', 'statique', 'css', 'ressources', 'indicateur_lignes.css'), LignesManager_1.default.genererCSS(), function (err) {
            if (err)
                throw err;
            Logger_1.default.log.success('Ressources', 'Génération du fichier ', 'indicateur_lignes.css', '... ', 'OK!');
        });
    }
}
exports.default = Application;
