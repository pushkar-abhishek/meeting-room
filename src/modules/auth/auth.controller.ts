import * as changeCase from 'change-case';
import { Application, Request, Response } from 'express';
import * as randomstring from 'randomstring';
import { BaseController } from '../BaseController';
import {
  AuthHelper,
  EmailServer,
  ResponseHandler,
  Utils,
} from './../../helpers';
import { UserLib } from './../user/user.lib';
import { userRules } from './../user/user.rules';
import { IUser } from './../user/user.type';

/**
 * AuthController
 */
export class AuthController extends BaseController {
  constructor() {
    super();
    this.init();
  }

  public register(app: Application): void {
    app.use('/api/auth', this.router);
  }

  public init(): void {
    const authHelper: AuthHelper = new AuthHelper();
    this.router.post(
      '/sign-up',
      userRules.forSignUser,
      authHelper.validation,
      this.signUp,
    );
    this.router.post(
      '/login',
      userRules.forSignIn,
      authHelper.validation,
      this.login,
    );
    this.router.post('/forgot-password', this.forgotPassword);
    this.router.post('/reset-password',
                     authHelper.validation,
                     userRules.resetPassword,
                     this.resetPassword);
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

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const user: UserLib = new UserLib();
      const { email, password } = req.body;
      const loggedInUser: any = await user.loginUserAndCreateToken(
        email,
        password,
      );
      res.locals.data = loggedInUser;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.errorCode = 401;
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'login');
    }
  }

  public async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const user: UserLib = new UserLib();
      const mailer: EmailServer = new EmailServer();

      const email: string = req.body.email ? req.body.email : null;
      const userData: IUser = await user.getUserByEmail(email);
      const verification_code: any = changeCase.lowerCase(randomstring.generate(6));

      await user.updateUser(userData._id, {
        account_recovery_code: verification_code,
      });
      const options: any = {
        subject: 'Forgot Password',
        templateName: 'password-reset',
        to: userData.email,
        replace: {
          code: verification_code,
        },
      };
      mailer
        .sendEmail(options)
        .then()
        .catch();
      ResponseHandler.JSONSUCCESS(req, res);
      await mailer.sendEmail(options);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'forgotPassword');
    }
  }

  public async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const user: UserLib = new UserLib();
      const verification_code: string = req.body.verification_code ? req.body.verification_code : null;
      const userData: IUser = await user.getUserByVerificationCode(verification_code);
      if (!userData || !userData.account_recovery_code) {
        throw new Error('You might not have yet requested for the Reset Password');
      } else {
        userData.password = req.body.password.trim();
        userData.account_recovery_code = '';
        const userResult: IUser = await user.saveUser(userData);
        res.locals.data = userResult;
        ResponseHandler.JSONSUCCESS(req, res);
      }
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'resetPassword');
    }
  }
}
