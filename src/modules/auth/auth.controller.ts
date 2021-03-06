import * as changeCase from 'change-case';
import * as crypto from 'crypto';
import { Application, Request, Response } from 'express';
import * as randomstring from 'randomstring';
import { BaseController } from '../BaseController';
import { AuthHelper, EmailServer, ResponseHandler } from './../../helpers';
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
    this.router.post(
      '/reset-password',
      authHelper.validation,
      userRules.resetPassword,
      this.resetPassword,
    );
    this.router.post('/resend-code', this.resendVerificationCode);
  }

  /**
   * API to register (User Only)
   * @param req
   * @param res
   */
  public async signUp(req: Request, res: Response): Promise<void> {
    try {
      const user: UserLib = new UserLib();
      const mailer: EmailServer = new EmailServer();
      const userData: IUser = req.body;
      // tslint:disable-next-line: await-promise
      const verificationToken: string = changeCase.lowerCase(randomstring.generate(4));
      const userResult: IUser = await user.addUser(userData, verificationToken);

      // const verifyAccountURL: string = await this.generateVerifyAccountUrl(userResult._id);

      const options: any = {
        subject: 'Verify Account',
        templateName: 'verify-account',
        to: userData.email,
        replace: {
          code: verificationToken,
          name: changeCase.titleCase(userResult.first_name),
        },
      };

      res.locals.data = userResult;

      ResponseHandler.JSONSUCCESS(req, res);
      await mailer.sendEmail(options);
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
      if (!userData) {
        throw new Error('Wrong Email Provided');
      }
      const verificationCode: any = changeCase.lowerCase(randomstring.generate(4));
      const resetPasswordExpires: any = Date.now() + 3600000; // 1 hour from now

      await user.updateUser(userData._id, {
        account_recovery_code: verificationCode,
        resetPasswordExpires: resetPasswordExpires,
      });

      const options: any = {
        subject: 'Forgot Password',
        templateName: 'password-reset',
        to: userData.email,
        replace: {
          code: verificationCode,
        },
      };
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
      const verificationCode: string = req.body.verification_code
        ? req.body.verification_code
        : null;
      const userData: IUser = await user.getUserByVerificationCode(
        verificationCode,
      );
      if (!userData || !userData.account_recovery_code) {
        throw new Error(
          'You might not have yet requested for the Reset Password',
        );
      } else {
        const isExpired: IUser = await user.checkForExpiry(userData._id);
        if (!isExpired) {
          throw new Error(
            'Password Link Expired',
          );
        } else {
          userData.password = req.body.password.trim();
          userData.account_recovery_code = '';
          const userResult: IUser = await user.saveUser(userData);
          res.locals.data = userResult;
          ResponseHandler.JSONSUCCESS(req, res);
        }
      }
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'resetPassword');
    }
  }

  public async resendVerificationCode(req: Request, res: Response): Promise<void> {
    try {
      const user: UserLib = new UserLib();
      const mailer: EmailServer = new EmailServer();
      const userData: IUser = await user.getUserByEmail(req.body.email);
      if (!userData) {
        throw new Error(
          'User not registered',
        );
      } else {
        if (!userData.verification_token == null) {
          const verificationCode: any = changeCase.lowerCase(randomstring.generate(4));
          const resetPasswordExpires: any = Date.now() + 3600000; // 1 hour from now

          await user.updateUser(userData._id, {
            account_recovery_code: verificationCode,
          });
          const options: any = {
            subject: 'Forgot Password',
            templateName: 'password-reset',
            to: userData.email,
            replace: {
              code: verificationCode,
              resetPasswordExpires: resetPasswordExpires,
            },
          };
          ResponseHandler.JSONSUCCESS(req, res);
          await mailer.sendEmail(options);

        } else {
          const options: any = {
            subject: 'Forgot Password',
            templateName: 'password-reset',
            to: userData.email,
            replace: {
              code: userData.verification_token,
              resetPasswordExpires: Date.now() + 3600000,
            },
          };
          ResponseHandler.JSONSUCCESS(req, res);
          await mailer.sendEmail(options);
        }
      }
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'resetPassword');
    }
  }
}
