import { Document } from 'mongoose';

export interface IBooking extends Document {
  id?: string;
}

export interface IBookingRequest {
  id?: string;
}
