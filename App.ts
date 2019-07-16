import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as mongoose from 'mongoose';
import { registerRoutes } from './src/routes';

export class App {

    public express: express.Application;
    public mongoUrl: string = process.env.MONGO_URL;
    public httpServer: http.Server;

    constructor() {
        this.express = express();

        this.middleware();
        this.mongoSetup();
        this.setupRoutes();
        this.httpServer = http.createServer(this.express);
    }

    private middleware(): void {

        // cors
        this.express.use(cors());
        // this.express.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        //     const allowedOrigins: string[] = ['http://127.0.0.1:4200', 'http://10.0.29.42:4200', 'http://localhost:4200'];
        //     const origin: any = req.headers.origin;
        //     if (allowedOrigins.indexOf(origin) > -1) {
        //          res.setHeader('Access-Control-Allow-Origin', origin);
        //     }

        //     res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
        //     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        //     res.header('Access-Control-Allow-Credentials', 'true');
        //     next();
        // });

        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: true }));
    }

    private setupRoutes(): void {
        registerRoutes(this.express);
    }
    private mongoSetup(): void {
        mongoose.set('debug', true);
        mongoose.connect(this.mongoUrl, { autoIndex: true, useNewUrlParser: true, useCreateIndex: true });
    }
}
