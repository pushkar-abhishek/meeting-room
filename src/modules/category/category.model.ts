import { model, Model, Schema } from 'mongoose';
import { ICategory } from './category.type';

export const categorySchema: Schema = new Schema (
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

export const categoryModel: Model<ICategory> = model<ICategory>('Category', categorySchema);
