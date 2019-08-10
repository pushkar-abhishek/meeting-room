import { Document, model, PaginateModel, Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { IUser } from './user.type';

export const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    first_name: {
      required: 'Enter a first name',
      trim: true,
      type: String,
      default: null,
    },
    last_name: {
      trim: true,
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
      trim: true,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: 'location',
      default: null,
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'user'],
      default: 'user',
    },
    department: {
      type: String,
      default: null,
      trim: true,
    },
    account_recovery_code: {
      type: String,
      default: null,
      trim: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    verification_token: {
      type: String,
      default: null,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.plugin(mongoosePaginate);
interface IUserModel<T extends Document> extends PaginateModel<T> {}

export const userModel: IUserModel<IUser> = model<IUser>('User', userSchema);
