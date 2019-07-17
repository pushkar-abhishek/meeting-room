import { Document } from 'mongoose';

export interface ICart extends Document {
  _id: string;
  user_id: string;
  product_id: string;
  quantity: number;
}
