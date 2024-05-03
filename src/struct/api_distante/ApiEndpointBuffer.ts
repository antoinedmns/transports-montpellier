import request from 'request';
import Logger from '../internal/Logger';
import { kml } from "@tmcw/togeojson";
import { DOMParser } from 'xmldom';
import type { Geometry, FeatureCollection, GeoJsonProperties } from 'geojson';
import protobuf, { Message } from 'protobufjs';
import path from 'path';
import ApiEndpointHTTP from './ApiEndpointHTTP';
import ApiEndpointAbstract from './ApiEndpointAbstract';

export default abstract class ApiEndpointBuffer extends ApiEndpointAbstract<Buffer> {

    /**
     * Récupérer les données du fichier distant à l'adresse donnée dans la propriété 'cheminDistant".
     * @returns Le contenu du fichier distant, au format buffer
     */
    public async recupererDonnees(): Promise<Buffer> {

        const response = await fetch(this.cheminDistant);
        return Buffer.from(await response.arrayBuffer());

    }

    /**
     * Extraire les données Protobuf
     */
    public async extraireProtobuf<D>(donneesRaw: Buffer): Promise<D> {

        return await new Promise((resolve) => {

            protobuf.load(path.join(__dirname, '..', '..', '..', 'statique', 'protobuffers', 'gtfs-rt.proto'), (err, root) => {

                if (err) console.log(err);
                if (!root) { resolve(null as D); return; }
                
                const FeedMessage = root.lookupType("transit_realtime.FeedMessage");
                const messageDecode = FeedMessage.decode(donneesRaw);

                resolve(messageDecode.toJSON().entity)
                
            });

        });

    }

}
