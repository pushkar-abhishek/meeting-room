import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';
import * as mongoose from 'mongoose';
import { logger } from './src/logger';
import { registerRoutes } from './src/routes';

export class App {

    public express: express.Application;
    public mongoUrl: string = process.env.MONGO_URL;
    public httpServer: http.Server;

    constructor() {
        this.express = express();

        this.middleware();
        this.setupRoutes();
        this.mongoSetup();
        this.httpServer = http.createServer(this.express);
        logger.warn('logger called from app');
    }

    private middleware(): void {

        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: true }));
    }

    private setupRoutes(): void {
        registerRoutes(this.express);
    }
    private mongoSetup(): void {
        mongoose.connect(this.mongoUrl, { autoIndex: false });
    }
}

export const httpServer: http.Server = new App().httpServer;
