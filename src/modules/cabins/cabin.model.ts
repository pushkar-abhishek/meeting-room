import { Document, model, PaginateModel, Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { ICabin } from './cabin.type';

export const cabinSchema: Schema = new Schema(
  {
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      default: null,
    },
    capacity: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        default: null,
      },
    ],
  },
  { timestamps: true },
);

cabinSchema.plugin(mongoosePaginate);
interface IUserModel<T extends Document> extends PaginateModel<T> { }

export const cabinModel: IUserModel<ICabin> = model<ICabin>(
  'cabin',
  cabinSchema,
);
