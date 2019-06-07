import * as express from 'express';

import { UserApi } from './modules/user/user.controller';

export function registerRoutes(app: express.Application): void {

    new UserApi().register(app);
}
