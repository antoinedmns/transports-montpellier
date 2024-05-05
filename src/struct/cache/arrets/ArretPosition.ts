export default class ArretPosition {
    
    /**
     * Longitude de l'arrêt
     */
    public longitude: number;

    /**
     * Latitude de l'arrêt
     */
    public latitude: number;

    /**
     * Position géographique d'un arrêt
     * @param longitude 
     * @param latitude 
     */
    constructor(longitude: number, latitude: number) {
        this.longitude = longitude;
        this.latitude = latitude;
    }

    /**
     * Vérifier si deux positions d'arrêts sont à proximité
     * @param position
     * @param maxDistanceLongitudinale (en degrés) distance maximale pour valider la proximité longitudinale. [0.001 = 111m]
     * @param maxDistanceLatitudinale (en degrés) distance maximale pour valider la proximité latitudinale. [0.001 = 111m]
     */
    public estProche(position: ArretPosition, maxDistanceLongitudinale: number, maxDistanceLatitudinale: number): boolean {
        return Math.abs(this.longitude - position.longitude) <= maxDistanceLongitudinale && Math.abs(this.latitude - position.latitude) <= maxDistanceLatitudinale;
    }

    /**
     * Vérifier si deux coordonnées sont à proximité
     * @param longitude
     * @param latitude
     * @param maxDistanceLongitudinale (en degrés) distance maximale pour valider la proximité longitudinale. [0.001 = 111m]
     * @param maxDistanceLatitudinale (en degrés) distance maximale pour valider la proximité latitudinale. [0.001 = 111m]
     */
    public estProcheCoordonnees(longitude: number, latitude: number, maxDistanceLongitudinale: number, maxDistanceLatitudinale: number): boolean {
        return Math.abs(this.longitude - longitude) <= maxDistanceLongitudinale && Math.abs(this.latitude - latitude) <= maxDistanceLatitudinale;
    }


}