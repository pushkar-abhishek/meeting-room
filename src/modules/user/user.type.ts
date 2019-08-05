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
  account_recovery_code?: any;
}

export interface IUserRequest {
  password?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  location?: string;
  role?: string;
  department?: string;
  account_recovery_code?: any;
}
