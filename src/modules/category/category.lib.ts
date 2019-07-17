import { Types } from "mongoose";
import { categoryModel } from './category.model';
import { ICategory } from './category.type';

const isDelete: any = { isDelete: false };

/**
 * CategoryLib
 */
export class CategoryLib {
  public async getAllCategories(): Promise<ICategory[]> {
    return categoryModel.find({ ...isDelete });
  }

  public async getCategoryById(id: number): Promise<ICategory> {
    return categoryModel.findOne({ ...{ _id: id }, ...isDelete });
  }

  public async findByIdAndUpdate(
    id: Types.ObjectId,
    data: ICategory,
  ): Promise<ICategory> {
    return categoryModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  public async addCategory(data: ICategory): Promise<ICategory> {
    const categoryObj: ICategory = new categoryModel(data);

    return categoryObj.save();
  }

  public async getCategoryWiseProduct(): Promise<any> {
    return categoryModel.aggregate([
      { $match: { ...isDelete } },
      {
        $lookup: {
          from: 'products',
          as: 'categories_products',
          let: {
            cat_id: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$category_id', '$$cat_id'] },
                    { $eq: ['$isDelete', false] },
                  ],
                },
              },
            },
            { $limit: 5 },
          ],
        },
      },
    ]);
  }
}
