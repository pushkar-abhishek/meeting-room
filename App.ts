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

        this.express.use(cors());
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: true }));
    }

    private setupRoutes(): void {
        registerRoutes(this.express);
    }
    private mongoSetup(): void {
        mongoose.connect(this.mongoUrl, { autoIndex: true });
    }
}
