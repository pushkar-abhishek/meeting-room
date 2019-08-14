import * as moment from 'moment';
import { Document, model, PaginateModel, Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { IBooking } from './booking.type';

export const bookingSchema: Schema = new Schema(
  {
    occupied_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    booking_date: {
      type: String,
      default: null,
    },
    start_time: {
      type: Date,
      default: null,
    },
    end_time: {
      type: Date,
      default: null,
    },
    duration: {
      trim: true,
      type: String,
      default: null,
    },
    purpose: {
      type: String,
      default: null,
      trim: true,
    },
    cabin: {
      type: Schema.Types.ObjectId,
      ref: 'cabin',
      default: null,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: 'location',
      default: null,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

bookingSchema.plugin(mongoosePaginate);
interface IUserModel<T extends Document> extends PaginateModel<T> { }

export const bookingModel: IUserModel<IBooking> = model<IBooking>(
  'Booking',
  bookingSchema,
);

/*eslint no-shadow: "error"*/
/*eslint-env es6*/

// Validation to ensure a room cannot be double-booked
bookingSchema.path('start_time').validate(function (value: Date): any {
  const newLocal: any = this;
  // Extract the Room Id from the query object
  const cabinId: any = newLocal.cabin_id;
  const newbookingstart: any = value.getTime();
  const newbookingend: any = newLocal.end_time.getTime();

  const clashesWithExisting: any =
    (existingbookingstart: number,
     existingbookingend: number,
     newbookingstart: number,
     newbookingend: number): boolean => {
      if (newbookingstart >= existingbookingstart && newbookingstart < existingbookingend ||
        existingbookingstart >= newbookingstart && existingbookingstart < newbookingend) {

        throw new Error(
          `Booking could not be saved. There is a clash with an existing booking from
          ${moment(existingbookingstart).format('HH:mm Z')} to ${moment(existingbookingend).format('HH:mm on LL Z')}`,
        );
      }

      return false;
    };

  // Locate the cabin document containing the bookings
  return bookingModel.find({ cabin_id: cabinId })
    .then(rooms => {
      // Loop through each existing booking and return false if there is a clash
      return rooms.every(booking => {

        // Convert existing booking Date objects into number values
        const existingbookingstart: number = new Date(booking.start_time).getTime();
        const existingbookingend: number = new Date(booking.end_time).getTime();

        // Check whether there is a clash between the new booking and the existing booking
        return !clashesWithExisting(
          existingbookingstart,
          existingbookingend,
          newbookingstart,
          newbookingend,
        );
      });
    });
},                                        `{REASON}`);
