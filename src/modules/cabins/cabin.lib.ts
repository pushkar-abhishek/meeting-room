import { PaginateResult, Types } from 'mongoose';
// import { Messages, populate } from '../../constants';
import { cabinModel } from '../cabins/cabin.model';
import { ICabin, ICabinRequest } from './cabin.type';
// import { bookingModel } from '../bookings/booking.model';
import { IBooking, IBookingRequest } from '../bookings/booking.type';


export class CabinLib {
  public async addCabin(data: ICabinRequest): Promise<ICabin> {
    return cabinModel.create(data);
  }

  public async deleteCabin(cabinId: string): Promise<ICabin> {
    return cabinModel.findOneAndDelete({ _id: cabinId });
  }

  public async getCabin(id: string): Promise<ICabin> {
    return cabinModel.findOne({ _id: id });
  }

  public async getAllCabins(
    filters: any,
    options: any,
  ): Promise<PaginateResult<ICabin>> {
    return cabinModel.paginate(filters, options);
  }

  public async checkAvailable(location: string, start: string, end: string): Promise<IBooking[]> {

    return cabinModel.aggregate([
      { $match: { location: Types.ObjectId(location) } },
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'cabin',
          as: 'bookingInfo'
        }
      }
      // {
      //   $match: {

      //   }
      //     { $gte: start, $lt: end }
      // }

      // { $unwind: '$bookingInfo' },
      // {
      //   $project: {
      //     _id: '$_id',
      //     capacity: '$cabin.name',
      //     booking_date: '$booking'
      //   }
      // }
    ]);
  }
}
