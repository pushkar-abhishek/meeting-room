import { Application, Request, Response} from 'express';
import { AuthHelper, ResponseHandler } from '../../helpers';
import { BaseCotroller } from '../BaseController';
import { CategoryLib } from './category.lib';
import { categoryRule } from './category.rule';
import { ICategory } from './category.type';

export class CategoryController extends BaseCotroller {

    constructor () {
        super();
        this.init();
    }

    public register(app: Application) : void {

        app.use('/api/categories', this.router);
    }

    public init(): void {
        const authHelper: AuthHelper = new AuthHelper();

        this.router.get('/', authHelper.guard, this.listCategories);
        this.router.get('/:id', authHelper.guard, this.getCategory);
        this.router.post('/', authHelper.guard, categoryRule.forAdd, authHelper.validation, this.addCategory);
        this.router.get('/dashboard-products', this.getHomeList);
    }

    public async listCategories(req: Request, res: Response): Promise<void> {

        try {
            const categooryLib: CategoryLib = new CategoryLib();
            const categories: ICategory[] = await categooryLib.getAllCategories();
            res.locals.data = categories;
            ResponseHandler.JSONSUCCESS(req, res);
        } catch (err) {
            res.locals.data = err;
            ResponseHandler.JSONERROR(req, res, 'listCategories');
        }
    }

    public async getCategory(req: Request, res: Response): Promise<void> {

        try {
            const categooryLib: CategoryLib = new CategoryLib();
            const category: ICategory = await categooryLib.getCategoryById(req.params.id);
            if (!category) {
                throw Error('Invalid category id passed');
            }
            res.locals.data = category;
            ResponseHandler.JSONSUCCESS(req, res);
        } catch (err) {
            res.locals.data = err;
            ResponseHandler.JSONERROR(req, res, 'listCategories');
        }
    }

    public async addCategory(req: Request, res: Response): Promise<void> {

        try {
            const categooryLib: CategoryLib = new CategoryLib();
            const category: ICategory = await categooryLib.addCategory(req.body);
            res.locals.data = category;
            ResponseHandler.JSONSUCCESS(req, res);
        } catch (err) {
            res.locals.data = err;
            ResponseHandler.JSONERROR(req, res, 'listCategories');
        }
    }

    /**
     * getHomeProductList
     * @param req
     * @param res
     */
    public async getHomeList(req: Request, res: Response): Promise<void> {

        try {
            const categoryLib: CategoryLib = new CategoryLib();
            const categoryProducts: any = await categoryLib.getCategoryWiseProduct();
            res.locals.data = categoryProducts;
            ResponseHandler.JSONSUCCESS(req, res);
        } catch (err) {
            res.locals.data = err;
            ResponseHandler.JSONERROR(req, res, 'getProducts');
        }
    }
}
