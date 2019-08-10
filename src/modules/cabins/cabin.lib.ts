import { PaginateResult } from 'mongoose';
// import { Messages, populate } from '../../constants';
import { cabinModel } from './cabin.model';
import { ICabin, ICabinRequest } from './cabin.type';

// tslint:disable-next-line: completed-docs
export class CabinLib {
  public async addCabin(data: ICabinRequest): Promise<ICabin> {
    try {
      return cabinModel.create(data);
    } catch (err) {
      return Promise.reject({
        success: false,
        error: `${err}`,
      });
    }
  }

  // tslint:disable-next-line: no-reserved-keywords
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
}
