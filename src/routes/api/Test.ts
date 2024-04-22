import { Methodes } from "../../struct/express/Methodes";
import RouteAbstract from "../../struct/express/RouteAbstract";
import { Request, Response } from "express";

export default class Test extends RouteAbstract {

    public chemin = '/api/test/:test';
    public methode: Methodes = 'get';

    public execution(req: Request, res: Response): void {

        console.log('test', req.params.test);

        res.json({
            reponse: 'ok!',
            liste: ['saucisses', 'lentilles', 'poivrons'],
            nombre: 42,
            objet: {
                'flan à la noix de coco': {
                    sucre: '400g',
                    oeufs: 3,
                    'noix de coco': '125g',
                    'lait écremé': '400ml',
                    caramel: 'une cuillere a soupe'
                }
            },
            booleen: true,
            null: null,
            undefined: undefined,
            date: new Date('2018-09-11T12:00:00Z')
        });

    }

}