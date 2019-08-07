import { PaginateResult } from 'mongoose';
// import { Messages, populate } from '../../constants';
import { locationModel } from './location.model';
import { ILocation, ILocationRequest } from './location.type';

// tslint:disable-next-line: completed-docs
export class LocationLib {
  public async saveLocation(data: ILocationRequest): Promise<ILocation> {
    try {
      return locationModel.create(data);
    } catch (err) {
      return Promise.reject({
        success: false,
        error: `${err}`,
      });
    }
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
