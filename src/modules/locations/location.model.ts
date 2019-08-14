import { Document, model, PaginateModel, Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { ILocation } from './location.type';

export const locationSchema: Schema = new Schema(
  {
    name: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

locationSchema.plugin(mongoosePaginate);
interface ILocationModel<T extends Document> extends PaginateModel<T> { }

export const locationModel: ILocationModel<ILocation> = model<ILocation>(
  'Location',
  locationSchema,
);
