import { Document } from 'mongoose';

export interface ILocation extends Document {
  id: string;
  name: string;
}

export interface ILocationRequest {
  id?: string;
  name: string;
}
