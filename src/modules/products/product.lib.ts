import { PaginateResult } from 'mongoose';
import { productModel } from './product.model';
import { IProduct } from './product.type';

export class ProductLib {

    public async getProduct(filters: any, options: any): Promise<PaginateResult<IProduct>> {

        return productModel.paginate(filters, options);
    }

    public async addProduct(data: IProduct): Promise<IProduct> {

        const productObj: IProduct = new productModel(data);

        return productObj.save();
    }

}
