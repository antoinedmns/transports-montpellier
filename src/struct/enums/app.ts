export enum AppEtats {

    /**
     * L'application fonctionne et peut-être utilisée
     */
    FONCTIONNELLE,

    /**
     * L'application est en train de démarrer et est indisponible
     */
    PREPARATION_DEMARRAGE,

    /**
     * L'application s'apprête à être arrêtée, et est indisponible
     */
    PREPARATION_ARRET,

    /**
     * L'application à plannifié son arrêt sous quelques minutes
     */
    ARRET_PLANIFIE

}