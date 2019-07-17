import { Application, Request, Response } from 'express';
import { PaginateResult, Types } from 'mongoose';
import { BaseController } from '../BaseController';
import { AuthHelper, ResponseHandler, Utils } from './../../helpers';
import { CartLib } from './cart.lib';
import { ICart } from './cart.type';

/**
 * CartController
 *
 */
export class CartController extends BaseController {
  constructor() {
    super();
    this.init();
  }

  public register(app: Application): void {
    const authHelper: AuthHelper = new AuthHelper();
    app.use('/api/carts', authHelper.guard, this.router);
  }

  public init(): void {
    this.router.get('/pagination', this.getPaginatedCarts);
    this.router.get('/', this.getCarts);
    this.router.put('/:id', this.updateCart);
    this.router.delete('/:id', this.deleteCart);
    this.router.post('/', this.addProductIntoCart);
  }

  public async getPaginatedCarts(req: Request, res: Response): Promise<void> {
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
      const cart: CartLib = new CartLib();
      const carts: PaginateResult<ICart> = await cart.getPaginatedCarts(
        filters,
        options,
      );
      res.locals.data = carts.docs;
      res.locals.pagination = utils.getPaginateResponse(carts);
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'getProducts');
    }
  }

  public async getCarts(req: Request, res: Response): Promise<void> {
    try {
      const filters: any = {};
      const cart: CartLib = new CartLib();
      const carts: ICart[] = await cart.getCarts(filters);
      res.locals.data = carts;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'getProducts');
    }
  }

  /**
   * addProduct into cart
   * @param req
   * @param res
   */
  public async addProductIntoCart(req: Request, res: Response): Promise<void> {
    try {
      const cartLib: CartLib = new CartLib();
      req.body.user_id = req.body.loggedinUserId;
      res.locals.data = await cartLib.add(req.body);
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'addProductIntoCart');
    }
  }

  /**
   * Update Cart by id
   * @param req
   * @param res
   */
  public async updateCart(req: Request, res: Response): Promise<void> {
    const body: ICart = req.body;
    body.user_id = req.body.loggedinUserId;
    const id: Types.ObjectId = req.params.id;
    try {
      const product: any = await new CartLib().findByIdAndUpdate(id, body);
      res.locals.data = product;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'updateCart');
    }
  }

  /**
   * Delete Cart by id
   * @param req
   * @param res
   */
  public async deleteCart(req: Request, res: Response): Promise<void> {
    const id: Types.ObjectId = req.params.id;
    try {
      const deletedProduct: any = await new CartLib().deleteById(id);
      res.locals.data = deletedProduct;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'deleteCart');
    }
  }
}
