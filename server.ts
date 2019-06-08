import * as dotenv from 'dotenv';
import { logger } from './src/logger';
dotenv.config();
import * as http from 'http';
import { App } from './App';
const PORT: number = Number(process.env.PORT);
console.log('process.env.PORT ', process.env.PORT);

const httpServer: http.Server = new App().httpServer;
httpServer.on('error', serverError);
httpServer.on('listening', serverListening);
httpServer.listen(PORT);

function serverError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') {
        throw error;
    }
    throw error;
}

function serverListening(): void {
    logger.info(`Server listening on : ${PORT}`);
}

process.on('unhandledRejection', (reason: Error) => {
    logger.error('Unhandled Promise Rejection: reason:', reason.message);
    logger.error(reason.stack);
    process.exit(1);
});
