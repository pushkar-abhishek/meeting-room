import { categoryModel } from './category.model';
import { ICategory } from './category.type';
import { ProductHelper } from '../../helpers/ProductHelper';

export class CategoryLib {

    public async getAllCategories(): Promise<ICategory[]> {

        return categoryModel.find();
    }

    public async getCategoryById(id: number): Promise<ICategory> {

        return categoryModel.findById(id);
    }

    public async addCategory(data: ICategory): Promise<ICategory> {

        const categoryObj: ICategory = new categoryModel (data);

        return categoryObj.save();
    }

    public async getCategoryWiseProduct(): Promise<any> {

        let data = await  categoryModel.aggregate([
            {
                $lookup: {
                    from: 'products', //collection name not a model name
                    localField: '_id',
                    foreignField: 'category_id',
                    as: 'category_products',
                },
            },
            {
                $match : {
                    category_products: { $exists: true, $ne: [],
                    },
                },
            },
            {
                
            }
        ]);


        data.forEach((el) => {
            let category_products : Array<any> = []
            let bset = ProductHelper.findUnique(el.category_products);
            bset.forEach((s) => {
                category_products.push(el.category_products.find((d :any) => d && d.brand == s))
            })
            el.category_products = category_products;
        })

        return data;
    }
}
