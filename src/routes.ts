import * as express from 'express';

import { AuthController } from './modules/auth/auth.controller';
import { LocationController } from './modules/locations/location.controller';
import { UserController } from './modules/user/user.controller';

export function registerRoutes(app: express.Application): void {
  new UserController().register(app);
  new AuthController().register(app);
  new LocationController().register(app);
}
