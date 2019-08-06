import { Document, model, PaginateModel, Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { ICabin } from './cabin.type';

export const cabinSchema: Schema = new Schema({
    location: {
        type: Schema.Types.ObjectId,
        ref: 'location',
        default: null,
    },
    locality: {
        type: String,
        default: null,
    },
    is_occupied: {
        type: Boolean,
        default: false,
    },
    occupied_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    capacity: {
        type: String,
        default: null,
    },

},                                            { timestamps: true });

cabinSchema.plugin(mongoosePaginate);
interface IUserModel<T extends Document> extends PaginateModel<T> { }

export const cabinModel: IUserModel<ICabin> = model<ICabin>('Booking', cabinSchema);
