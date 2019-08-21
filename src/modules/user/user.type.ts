import { Document } from 'mongoose';
export interface IUser extends Document {
  _id: string;
  password?: string;
  email?: string;
  first_name: string;
  last_name: string;
  location?: string;
  role?: string;
  is_active: boolean;
  department: any;
  is_verified: boolean;
  verification_token?: any;
  account_recovery_code?: any;
  resetPasswordExpires?: any;
}

export interface IUserRequest {
  password?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  location?: string;
  role?: string;
  verifiedEmail?: boolean;
  department?: string;
  token?: any;
  account_recovery_code?: any;
  resetPasswordExpires?: any;
}
