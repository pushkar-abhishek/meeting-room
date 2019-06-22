import { Application, Request, Response} from 'express';
import { BaseCotroller } from '../BaseController';
import { AuthHelper, EmailServer, ResponseHandler } from './../../helpers';
import { UserLib } from './../user/user.lib';
import { userRules } from './../user/user.rules';
import { IUser } from './../user/user.type';

export class AuthController extends BaseCotroller {

    constructor() {
        super();
        this.init();
    }

    public register(app: Application): void {
        app.use('/api/auth', this.router);
    }

    public init(): void {
        const authHelper: AuthHelper = new AuthHelper();
        this.router.post('/sign-up', userRules.forSignUser, authHelper.validation, this.signUp);
        this.router.post('/login', userRules.forSignIn, authHelper.validation, this.login);
        this.router.post('/forgot-password', this.forgotPasword);
    }

    public async signUp(req: Request, res: Response): Promise<void> {
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

    public async login(req: Request, res: Response): Promise <void> {
        try {
            const user: UserLib = new UserLib();
            const {email, password} = req.body;
            const loggedInUser: any = await user.loginUserAndCreateToken(email, password);
            res.locals.data = loggedInUser;
            ResponseHandler.JSONSUCCESS(req, res);
        } catch (err) {
            res.locals.errorCode = 401;
            res.locals.data = err;
            ResponseHandler.JSONERROR(req, res, 'login');
        }
    }

    public async forgotPasword(req: Request, res: Response): Promise<void> {
        try {

            const user: UserLib = new UserLib();
            const email: string = req.body.email ? req.body.email : null;
            const userData: IUser = await user.getUserByEmail(email);
            const mailer: EmailServer = new EmailServer();
            res.locals.data = userData;
            mailer.sendEmail({ to: 'sandip.ghadge@wwindia.com'});
            ResponseHandler.JSONSUCCESS(req, res);
        } catch (err) {
            res.locals.data = err;
            ResponseHandler.JSONERROR(req, res, 'forgotPasword');
        }
    }
}
