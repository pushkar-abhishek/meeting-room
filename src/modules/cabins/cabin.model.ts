import { Document, model, PaginateModel, Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { ICabin } from './cabin.type';

export const cabinSchema: Schema = new Schema({
    location: {
        type: Schema.Types.ObjectId,
        ref: 'location',
        default: null,
    },
    is_occupied: {
        type: Boolean,
        default: false,
    },
    booking_start_time: {
        type: Date,
        default: null,
    },
    booking_end_time: {
        type: Date,
        default: null,
    },
    duration: {
        type: Number,
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

},                                            { timestamps: true });

cabinSchema.plugin(mongoosePaginate);
interface IUserModel<T extends Document> extends PaginateModel<T> { }

export const cabinModel: IUserModel<ICabin> = model<ICabin>('cabin', cabinSchema);
