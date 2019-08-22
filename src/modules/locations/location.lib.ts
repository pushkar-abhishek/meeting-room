import { PaginateResult } from 'mongoose';
import { locationModel } from './location.model';
import { ILocation, ILocationRequest } from './location.type';

// tslint:disable-next-line:completed-docs
export class LocationLib {
  public async saveLocation(data: ILocationRequest): Promise<ILocation> {
    return locationModel.create(data);
  }

  public async deletelocation(locationId: string): Promise<ILocation> {
    return locationModel.findOneAndDelete({ _id: locationId });
  }

  public async getLocationById(id: string): Promise<ILocation> {
    return locationModel.findById(id);
  }

  public async getAll(
    filters: any,
    options: any,
  ): Promise<PaginateResult<ILocation>> {
    return locationModel.paginate(filters, options);
  }

  public async getAllCabins(): Promise<any> {
    return locationModel.aggregate([
      { $project: { city: 1, name: 1 } },
      {
        $group: { _id: '$city', toalCabins: { $sum: 1 }, cabins: { $push: { area: "$name", _id: '$_id' } } }
      },
    ]);
  }

}

