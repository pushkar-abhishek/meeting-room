import { Document } from 'mongoose';

export interface ILocation extends Document {
  id: string;
  name: string;
  city?: string;
}

export interface ILocationRequest {
  id?: string;
  name: string;
  city?: string;
}
