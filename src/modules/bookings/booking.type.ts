import { Document } from 'mongoose';

export interface IBooking extends Document {
  id?: string;
  start_time?: any;
  end_time?: any;
  cabin?: any;
  location: any;
  occupied_by: string;
  booking_date?: any;
  purpose?: string;
  duration?: any;
}

export interface IBookingRequest {
  booked_by: any;
  id?: string;
  booking_date?: any;
  start_time?: any;
  end_time?: any;
  purpose?: string;
  cabin?: any;
  location?: any;
  occupied_by: string;
  mails?: [];
}
