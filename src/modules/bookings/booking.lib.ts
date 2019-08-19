import { PaginateResult, Types } from 'mongoose';
import { bookingModel } from './booking.model';
import { IBooking, IBookingRequest } from './booking.type';

// tslint:disable-next-line:completed-docs
export class BookingLib {
    public async addBooking(data: IBookingRequest): Promise<IBooking> {
        return bookingModel.create(data);
    }

    public async deleteCabin(cabinId: string): Promise<IBooking> {
        return bookingModel.findOneAndDelete({ _id: cabinId });
    }

    public async getCabin(id: string): Promise<IBooking> {
        return bookingModel.findOne({ _id: id });
    }

    public async freeHook(): Promise<IBooking> {
        return bookingModel.findOne({});
    }

    public async cancelBooking(booking: string): Promise<IBooking> {
        return bookingModel.update({ _id: booking }, { $set: { isCancelled: true } });

    }

    public async myBooking(booking: string): Promise<IBooking> {
        return bookingModel.findById(booking);
    }

    public async getAll(
        filters: any,
        options: any,
    ): Promise<PaginateResult<IBooking>> {
        return bookingModel.paginate(filters, options);
    }
}
