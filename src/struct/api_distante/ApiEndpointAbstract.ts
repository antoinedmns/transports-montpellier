import Logger from '../internal/Logger';

export default abstract class ApiEndpointAbstract<D> {

    /**
     * Chemin distant vers le fichier à télécharger
     */
    public abstract cheminDistant: string;

    /**
     * Nom de l'endpoint à récupérer, utilisé pour le débuggage principalement
     */
    public abstract nom: string;
    
    /**
     * Récupérer les données du fichier distant à l'adresse donnée dans la propriété 'cheminDistant".
     * @returns Le contenu du fichier distant, au format texte
     */
    public abstract recupererDonnees(): Promise<D>;

    /**
     * Récupérer et parser les données distantes
     */
    public async recuperer() {

        // Récupération des données
        const donnees = await this.recupererDonnees()
            .catch((erreur) => Logger.log.error('Api', 'Erreur lors de la récupération des données pour ', this.nom, '. Erreur : ', erreur));

        // Parsage des données
        if (donnees) this.parser(donnees);

    }

    /**
     * Parser les données distantes
     * @returns true; si le parsage à réussi, false sinon
     */
    public abstract parser(donneesRaw: D): boolean | Promise<boolean>;

}
