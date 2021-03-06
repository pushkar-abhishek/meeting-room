import { PaginateResult, Types } from 'mongoose';
import { cabinModel } from '../cabins/cabin.model';
import { ICabin, ICabinRequest } from './cabin.type';

export class CabinLib {
  public async addCabin(data: ICabinRequest): Promise<ICabin> {
    return cabinModel.create(data);
  }

  public async deleteCabin(cabinId: string): Promise<ICabin> {
    return cabinModel.findOneAndDelete({ _id: cabinId });
  }

  public async getCabin(id: string): Promise<ICabin> {
    return cabinModel.findOne({ _id: id }).populate('bookings').populate('location', ['name', 'city']);
  }

  public async getAllCabins(
    filters: any,
    options: any,
  ): Promise<PaginateResult<ICabin>> {
    return cabinModel.paginate(filters, options);
  }

  public async checkAvailable(
    location: string,
    start: string,
    end: string,
  ): Promise<ICabin[]> {
    return cabinModel.aggregate([
      { $match: { location: Types.ObjectId(location) } },
      { $unwind: { path: '$booking', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'bookings',
          localField: 'booking',
          foreignField: '_id',
          as: 'bookingInfo',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'bookingInfo.occupied_by',
          foreignField: '_id',
          as: 'bookedUser',
        },
      },
      { $unwind: { path: '$bookedUser', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'bookings',
          localField: 'booking',
          foreignField: '_id',
          as: 'bookingInfo',
        },
      },
      {
        $project: {
          _id: 1,
          bookedUser: 1,
          bookingInfo: 1,
          cabin_name: '$name',
          capacity: '$capacity',
        },
      },
    ]);
  }

  public async arrayPush(id: string, bookId: string): Promise<ICabin> {
    return cabinModel.findOneAndUpdate(
      { _id: id },
      { $push: { bookings: bookId } },
      { new: true },
    );
  }

  public async pullBooking(cabin: string, bookingid: string): Promise<ICabin> {
    return cabinModel.findByIdAndUpdate(cabin, {
      $pull: { bookings: bookingid },
    }, { new: true });
  }

  public async getCabinsFromLocation(location: string): Promise<any> {
    return cabinModel.aggregate([
      { $match: { location: Types.ObjectId(location) } },


      { $project: { city: 1, name: 1, capacity: 1, bookings: 1 } },
      {
        $lookup: {
          from: 'bookings',
          localField: 'bookings',
          foreignField: '_id',
          as: 'bookings',
        }
      }
    ])
  }
}
