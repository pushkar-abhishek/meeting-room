import { PaginateResult } from 'mongoose';
// import { Messages, populate } from '../../constants';
import { locationModel } from './location.model';
import { ILocation, ILocationRequest } from './location.type';

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
}
