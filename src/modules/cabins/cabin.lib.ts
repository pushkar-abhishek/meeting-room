import { PaginateResult } from 'mongoose';
// import { Messages, populate } from '../../constants';
import { cabinModel } from './cabin.model';
import { ICabin, ICabinRequest } from './cabin.type';

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

    public async delete(cabinId: string): Promise<ICabin> {
        return cabinModel.findOneAndDelete({ _id: cabinId });

    }

    public async getCabin(id: string): Promise<ICabin> {
        return cabinModel.findOne({ _id: id }, { location: { $exists: true } });
    }

    public async getAllCabins(
        filters: any,
        options: any,
    ): Promise<PaginateResult<ICabin>> {
        return cabinModel.paginate(filters, options);
    }
}
