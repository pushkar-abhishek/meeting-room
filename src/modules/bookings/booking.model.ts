import { Document, model, PaginateModel, Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { IBooking } from './booking.type';

export const bookingSchema: Schema = new Schema({
    occupied_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    booking_date: {
        type: String,
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
    cabinId: {
        type: Schema.Types.ObjectId,
        ref: 'location',
        default: null,
    },
},                                              { timestamps: true });

bookingSchema.plugin(mongoosePaginate);
interface IUserModel<T extends Document> extends PaginateModel<T> { }

export const bookingModel: IUserModel<IBooking> = model<IBooking>('Booking', bookingSchema);
