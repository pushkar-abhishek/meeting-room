import { Application, Request, Response } from 'express';
import { PaginateResult } from 'mongoose';
import { BaseController } from '../BaseController';
import { AuthHelper, ResponseHandler, Utils } from './../../helpers';
import { logger } from './../../logger';
import { UserLib } from './user.lib';
import { userRules } from './user.rules';
import { IUser } from './user.type';

/**
 * UserController
 */
export class UserController extends BaseController {
  constructor() {
    super();
    this.init();
  }

  public init(): void {
    const authHelper: AuthHelper = new AuthHelper();

    this.router.get('/', authHelper.guard, this.getUsers);
    this.router.get('/:id', authHelper.guard, this.getUserById);
    this.router.put(
      '/:id',
      authHelper.guard,
      userRules.forUpdateUser,
      authHelper.validation,
      this.updateUser,
    );
    this.router.delete('/:id', this.deleteUser);
  }

  public register(app: Application): void {
    app.use('/api/users', this.router);
  }

  public async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const utils: Utils = new Utils();
      const filters: any = {};
      const select: string = '-password';

      const options: any = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 2,
      };
      const user: UserLib = new UserLib();
      const users: PaginateResult<IUser> = await user.getUsers(
        filters,
        select,
        options,
      );
      res.locals.data = users.docs;
      res.locals.pagination = utils.getPaginateResponse(users);
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'getUsers');
    }
  }

  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user: UserLib = new UserLib();
      const userDetails: IUser = await user.getUserById(req.params.id);
      res.locals.data = userDetails;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'getUserById');
    }
  }

  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = req.params && req.params.id;
      if (userId !== req.body.loggedinUserId) {
        throw new Error('You are not owner to update details');
      }
      const userData: IUser = req.body;
      delete userData.password;
      const user: UserLib = new UserLib();
      const updatedUserResult: IUser = await user.updateUser(userId, userData);
      logger.info('user updated');
      res.locals.data = updatedUserResult;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'updateUser');
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<any> {
    try {
      throw new Error('Not Allowed now');
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'deleteUser');
    }
  }
}
