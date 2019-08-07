import { Document } from 'mongoose';

export interface ICabin extends Document {
    id: string;
    is_occupied?: boolean;
    capacity?: any;
    name: any;
}

export interface ICabinRequest {
    id?: string;
    cabin_id?: string;
    is_occupied?: boolean;
    capacity?: any;
    location?: string;
    name: any;
}
