import { Application, Request, Response} from 'express';
import { PaginateResult } from 'mongoose';
import { BaseCotroller } from '../BaseController';
import { AuthHelper, ResponseHandler, Utils } from './../../helpers';
import { ProductLib } from './product.lib';
import { IProduct } from './product.type';
import { CategoryLib } from './../category/category.lib';

export class ProductController extends BaseCotroller {

    constructor() {
        super();
        this.init();
    }

    public register(app: Application): void {
        app.use('/api/products', this.router);
    }

    public init(): void {
        const authHelper: AuthHelper = new AuthHelper();
        this.router.get('/', this.getProducts);
        this.router.post('/', authHelper.validation, this.addProduct);
        this.router.get('/home-list', this.getHomeList)
    }

    public async getProducts(req: Request, res: Response): Promise<void> {

        try {
            const utils: Utils = new Utils();
            const filters: any = {};
            if (req.query && req.query.brand) {
                filters.brand = req.query.brand;
            }
            const options: any = {
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
            };
            const user: ProductLib = new ProductLib();
            const users: PaginateResult<IProduct> = await user.getProduct(filters, options);
            res.locals.data = users.docs;
            res.locals.pagination = utils.getPaginateResponse(users);
            ResponseHandler.JSONSUCCESS(req, res);
        } catch (err) {
            res.locals.data = err;
            ResponseHandler.JSONERROR(req, res, 'getProducts');
        }
    }

    /**
     * addProduct
     * @param req
     * @param res
     */
    public async addProduct(req: Request, res: Response): Promise<void> {

        try {
            const productLib: ProductLib = new ProductLib();
            res.locals.data = await productLib.addProduct(req.body);
            ResponseHandler.JSONSUCCESS(req, res);
        } catch (err) {
            res.locals.data = err;
            ResponseHandler.JSONERROR(req, res, 'addProduct');
        }
    }

    /**
     * getHomeProductList
     * @param req
     * @param res
     */
    public async getHomeList(req: Request, res: Response): Promise<void> {

        // try {
        //     const user: ProductLib = new ProductLib();
        //     const users: any = await user.getCategoryWiseProduct();
        //     res.locals.data = users;
        //     ResponseHandler.JSONSUCCESS(req, res);
        // } catch (err) {
        //     res.locals.data = err;
        //     ResponseHandler.JSONERROR(req, res, 'getProducts');
        // }

        try {
            const categoryLib: CategoryLib = new CategoryLib();
            const categoies: any = await categoryLib.getCategoryWiseProduct();
            res.locals.data = categoies;
            ResponseHandler.JSONSUCCESS(req, res);
        } catch (err) {
            res.locals.data = err;
            ResponseHandler.JSONERROR(req, res, 'getProducts');
        }
    }
}
