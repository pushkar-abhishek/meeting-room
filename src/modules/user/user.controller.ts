import { Application, Request, Response } from 'express';
import { BaseCotroller } from '../BaseApi';
import { logger } from './../../logger';
import { UserLib } from './user.lib';
import { IUser } from './user.type';

export class UserApi extends BaseCotroller {

    constructor() {
        super();
        this.init();
    }

    public register(express: Application) : void {
        express.use('/api/users', this.router);
    }

    public async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const user: UserLib = new UserLib();
            const users: IUser[] = await user.getUsers();
            res.send(users);
        } catch (err) {
            logger.info(JSON.stringify({'json data': err}));
            res.send(err);
        }
    }

    public async getUserById(req: Request, res: Response): Promise <void> {
        try {
            logger.info(JSON.stringify({'user callled' : req.params}));
            const user: UserLib = new UserLib();
            const userDetails: IUser = await user.getUserById(req.params.id);
            res.json(userDetails);
        } catch (err) {
            res.send(err);
        }
    }

    public async addUser(req: Request, res: Response): Promise<void> {
        try {
            const user: UserLib = new UserLib();
            const userData: IUser = req.body;
            const userResult: IUser = await user.saveUser(userData);
            res.send(userResult);
        } catch (err) {
            logger.info(err);
            res.send(err);
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
            res.send(updatedUserResult);
        } catch (err) {
            logger.info('update called failed');
            res.send(err);
        }
    }

    public async deleteUser(req: Request, res: Response): Promise<any> {
        try {
            const user: UserLib = new UserLib();
            logger.info(`id ${req.params.id}`);
            logger.info('delete');

            const deletedUser: any = user.deleteUser(req.params.id);
            res.send(deletedUser);
        } catch (err) {
            logger.info(JSON.stringify(`delete err ${err}`));
            res.send(err);
        }
    }

    public async login(req: Request, res: Response): Promise <void> {
        try {
            logger.info('koged callled');
            const user: UserLib = new UserLib();
            const {email, password} = req.body;
            const loggedInUser: any = await user.loginUserAndCreateToken(email, password);
            if (loggedInUser && loggedInUser.token) {
                res.send(loggedInUser);
            } else {
                res.status(401).send({message: 'Invalid login details'});
            }
        } catch (err) {
            res.status(400).send({err});
        }
    }

    public init(): void {
        this.router.get('/', this.getUsers);
        this.router.get('/:id', this.getUserById);
        this.router.post('/', this.addUser);
        this.router.put('/:id', this.updateUser);
        this.router.delete('/:id', this.deleteUser);
        this.router.post('/login', this.login);
    }
}
