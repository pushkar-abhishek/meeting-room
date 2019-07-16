import { PaginateResult } from 'mongoose';
import { productModel } from './product.model';
import { IProduct } from './product.type';
/**
 * ProductLib
 */
export class ProductLib {

    public async getProduct(filters: any, options: any): Promise<PaginateResult<IProduct>> {

        return productModel.paginate(filters, options);
    }

    public async addProduct(data: IProduct): Promise<IProduct> {

        const productObj: IProduct = new productModel(data);

        return productObj.save();
    }

    public async getCategoryWiseProduct(): Promise<any> {

        return productModel.aggregate([
            {
                $lookup: {
                    from: 'categories', //collection name not a model name
                    localField: 'category_id',
                    foreignField: '_id',
                    as: 'category_products',
                },
            },
        ]);
    }

}
