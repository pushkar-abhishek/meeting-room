import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { PaginateResult } from 'mongoose';
import { Messages } from './../../constants';
// import { logger } from './../../logger';
import { userModel } from './user.model';
import { IUser, IUserRequest } from './user.type';

/**
 * UserLib
 *
 */
export class UserLib {

  public async generateHash(password: string): Promise<string> {
    return bcrypt.hashSync(password, 10);
  }

  public async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compareSync(password, hash);
  }

  public async getUsers(
    filters: any,
    options: any,
  ): Promise<PaginateResult<IUser>> {
    return userModel.paginate(filters, options);
  }

  public async getUserById(id: string): Promise<IUser> {
    return userModel.findById(id);
  }

  public async saveUser(userData: IUser): Promise<IUser> {
    userData.password = await this.generateHash(userData.password);
    const userObj: IUser = new userModel(userData);

    return userObj.save();
  }

  public async checkUserExistsForEmailOrUsername(emailTxt: string): Promise<IUser> {
    const query: object = { email: emailTxt };
    return userModel.findOne(query);
  }

  public async addUser(userData: IUser, verification_token: string): Promise<IUser> {
    try {
      const currentUser: IUser = await this.checkUserExistsForEmailOrUsername(userData.email);
      if (currentUser !== null) {
        const errorMessage: string =
          (currentUser.email === userData.email) ?
            Messages.USERNAME_ALREADY_EXIST :
            Messages.EMAIL_ALREADY_EXIST;

        return Promise.reject({
          success: false,
          error: errorMessage,
        });
      } else {
        userData.password = await this.generateHash(userData.password);
        const userObj: IUser = new userModel(userData);
        userObj.verification_token = verification_token;
        return userObj.save();
      }
    } catch (err) {
      return Promise.reject({
        success: false,
        error: `${err}`,
      });
    }
  }

  public async getUserByEmail(email: string): Promise<IUser> {
    return userModel.findOne({ email: email }, '+password');
  }

  /**
   * generate Random token
   */
  public async generateRandomToken(): Promise<string> {
    return crypto.randomBytes(20).toString('hex');
  }

  public async getUserByVerificationCode(code: any): Promise<IUser> {
    return userModel.findOne({ account_recovery_code: code }, '-password');
  }

  /**
   * updateUser
   * @param userId
   * @param userData
   */
  public async updateUser(
    userId: string,
    userData: IUserRequest,
  ): Promise<any> {
    const user: IUser = await userModel.findById(userId);
    user.set(userData);
    return user.save();
  }

  public async deleteUser(id: string): Promise<IUser> {
    return userModel.findOneAndDelete({ _id: id });
  }

  public async getUserByResetPassToken(token: string): Promise<IUser> {
    return userModel.findOne(
      {
        verification_token: token,
        // resetPasswordExpires: { $gt: new Date() },
      });
  }

  public async patch(userId: string, userData: IUserRequest): Promise<IUser> {
    return userModel.findByIdAndUpdate({ _id: userId }, { $set: userData }, { new: true });
  }

  public async loginUserAndCreateToken(
    email: string,
    password: string,
  ): Promise<any> {
    let user: IUser = await this.getUserByEmail(email);
    user = JSON.parse(JSON.stringify(user));
    if (user !== null) {
      if (!user.is_active) {
        throw new Error(Messages.USER_DEACTIVATED);
      } else {
        if (!user.is_verified) {
          throw new Error(Messages.NOT_VERIFIED);
        } else {
          const isValidPass: boolean = await this.comparePassword(
            password,
            user.password,
          );
          if (isValidPass) {
            const token: string = jwt.sign({ id: user._id }, process.env.SECRET, {
              // expiresIn: '24h',
            });
            user.password = undefined;
            return { user, token };
          } else {
            throw new Error(Messages.INVALID_CREDENTIALS);
          }
        }
      }
    } else {
      throw new Error(Messages.INVALID_CREDENTIALS);
    }
  }
}

