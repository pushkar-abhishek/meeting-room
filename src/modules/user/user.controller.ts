import { Application, Request, Response } from 'express';
import { BaseCotroller } from '../BaseApi';
import { ResponseHandler } from './../../helpers';
import { logger } from './../../logger';
import { UserLib } from './user.lib';
import { IUser } from './user.type';

export class UserApi extends BaseCotroller {

    constructor() {
        super();
        this.init();
    }

    public init(): void {
        this.router.get('/', this.getUsers);
        this.router.get('/:id', this.getUserById);
        this.router.post('/', this.addUser);
        this.router.put('/:id', this.updateUser);
        this.router.delete('/:id', this.deleteUser);
        this.router.post('/login', this.login);
    }

    public register(app: Application) : void {
        app.use('/api/users', this.router);
    }

    public async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const user: UserLib = new UserLib();
            const users: IUser[] = await user.getUsers();
            res.locals.data = users;
            ResponseHandler.JSONSUCCESS(req, res);
        } catch (err) {
            res.locals.data = err;
            ResponseHandler.JSONERROR(req, res, 'getUsers');
        }
    }

    public async getUserById(req: Request, res: Response): Promise <void> {
        try {
            logger.info(JSON.stringify({'user callled' : req.params}));
            const user: UserLib = new UserLib();
            const userDetails: IUser = await user.getUserById(req.params.id);
            res.locals.data = userDetails;
            ResponseHandler.JSONSUCCESS(req, res);
        } catch (err) {
            res.locals.data = err;
            ResponseHandler.JSONERROR(req, res, 'getUserById');
        }
    }

    public async addUser(req: Request, res: Response): Promise<void> {
        try {
            const user: UserLib = new UserLib();
            const userData: IUser = req.body;
            const userResult: IUser = await user.saveUser(userData);
            res.locals.data = userResult;
            ResponseHandler.JSONSUCCESS(req, res);
        } catch (err) {
            res.locals.data = err;
            ResponseHandler.JSONERROR(req, res, 'addUser');
        }
    }

    public async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const userId: string = req.params && req.params.id;
            logger.info(`userId ${userId}`);
            const userData: IUser = req.body;
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
            const user: UserLib = new UserLib();
            logger.info(`id ${req.params.id}`);
            logger.info('delete');

            const deletedUser: any = user.deleteUser(req.params.id);
            res.locals.data = deletedUser;
            ResponseHandler.JSONSUCCESS(req, res);
        } catch (err) {
            res.locals.data = err;
            ResponseHandler.JSONERROR(req, res, 'deleteUser');
        }
    }

    public async login(req: Request, res: Response): Promise <void> {
        try {
            const user: UserLib = new UserLib();
            const {email, password} = req.body;
            const loggedInUser: any = await user.loginUserAndCreateToken(email, password);
            res.locals.data = loggedInUser;
            ResponseHandler.JSONSUCCESS(req, res);
        } catch (err) {
            console.log('err', err)
            res.locals.errorCode = 401;
            res.locals.data = err;
            ResponseHandler.JSONERROR(req, res, 'login');
        }
    }

}
