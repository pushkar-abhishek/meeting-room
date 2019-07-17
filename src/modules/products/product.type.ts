import { Document } from 'mongoose';

export interface IProduct extends Document {
  _id: string;
  category_id?: string;
  name?: string;
  price?: number;
  discount?: number;
  images?: String[];
  warranty?: string;
  general?: any;
  display_feature?: any;
  memory_storage?: any;
  camera?: any;
  connectivity_feature?: any;
  idDelete: Boolean;
}
