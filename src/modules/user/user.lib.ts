import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Messages } from './../../constants';
import { logger } from './../../logger';
import { userModel } from './user.model';
import { IUser } from './user.type';

export class UserLib {

    public async generateHash(password: string): Promise<string> {

        return bcrypt.hashSync(password, 10);
    }

    public async camparePassword(password: string, hash: string): Promise<boolean> {

        return bcrypt.compareSync(password, hash);
    }

    public async getUsers(): Promise<IUser[]> {
        return userModel.find();
    }

    public async getUserById(id: string): Promise<IUser> {
        return userModel.findById(id);
    }

    public async saveUser(userData: IUser): Promise<IUser> {
        userData.password = await this.generateHash(userData.password);
        const userObj: IUser = new userModel(userData);

        return userObj.save();
    }

    public async getUserByEmail(email: string): Promise<IUser> {
        return userModel.findOne({email: email});
    }

    public async updateUser(userId: string, userData: IUser): Promise<IUser> {
        const user: IUser = await userModel.findById(userId);
        user.set(userData);

        return user.save();
    }

    public async deleteUser(id: string): Promise<IUser> {

        return userModel.findOneAndDelete({_id: id});
    }

    public async loginUserAndCreateToken(email: string, password: string): Promise<any> {

        const user: IUser = await this.getUserByEmail(email);
        if (user !== null) {
            const isValidPass: boolean = await this.camparePassword(password, user.password);
            if (isValidPass) {
                const token: string = jwt.sign(
                                {id: user._id},
                                'secret',
                                { expiresIn: '24h'},
                            );

                return {user, token};
            } else {
                throw new Error(Messages.INVALID_CREDENTIALS);
            }
        } else {
            throw new Error(Messages.INVALID_CREDENTIALS);
        }
    }
}
