import { categoryModel } from './category.model';
import { ICategory } from './category.type';

export class CategoryLib {

    public async getAllCategories(): Promise<ICategory[]> {

        return categoryModel.find();
    }

    public async getCategoryById(id: number): Promise<ICategory> {

        return categoryModel.findById(id);
    }

    public async addCategory(data: ICategory): Promise<ICategory> {

        const categoryObj: ICategory = new categoryModel (data);
        console.log('data', data)

        return categoryObj.save();
    }
}
