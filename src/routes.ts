import * as express from 'express';

import { AuthController } from './modules/auth/auth.controller';
import { CategoryController } from './modules/category/category.controller';
import { ProductController } from './modules/products/product.controller';
import { UserController } from './modules/user/user.controller';

export function registerRoutes(app: express.Application): void {

    new UserController().register(app);
    new AuthController().register(app);
    new CategoryController().register(app);
    new ProductController().register(app);
}
