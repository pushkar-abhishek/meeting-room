
import * as dotenv from 'dotenv';
import { logger } from './src/logger';
dotenv.config();
import { httpServer } from './App';
const PORT: number = Number(process.env.PORT);

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
    // application specific logging, throwing an error, or other logic here
    process.exit(1);
});
