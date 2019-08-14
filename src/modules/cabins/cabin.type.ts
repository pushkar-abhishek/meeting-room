import { Document } from 'mongoose';

export interface ICabin extends Document {
  id: string;
  capacity?: any;
  name: any;
  bookings?: any;
}

export interface ICabinRequest {
  id?: string;
  cabin_id?: string;
  capacity?: any;
  location?: string;
  name: any;
}
