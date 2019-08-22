import { Application, Request, Response } from 'express';
import { AuthHelper, ResponseHandler, Utils } from '../../helpers';
import { BaseController } from '../BaseController';
import { UserLib } from '../user/user.lib';
import { IUser } from '../user/user.type';
import { Messages } from './../../constants';
import { LocationLib } from './location.lib';
import { ICabin, ICabinRequest } from '../cabins/cabin.type';
import { CabinLib } from '../cabins/cabin.lib';
import { ILocation, ILocationRequest } from './location.type';

/**
 * Location Controller
 *
 */
export class LocationController extends BaseController {
  constructor() {
    super();
    this.init();
  }
  public register(express: Application): void {
    express.use('/api/location', this.router);
  }

  public async addLocation(req: Request, res: Response): Promise<void> {
    try {
      const data: ILocationRequest = req.body;
      const user: UserLib = new UserLib();
      const location: LocationLib = new LocationLib();
      const userDetails: IUser = await user.getUserById(
        req.body.loggedinUserId,
      );
      if (userDetails.role === 'super_admin' || userDetails.role === 'admin') {
        const result: ILocation = await location.saveLocation(data);
        res.locals.data = result;
        res.locals.message = 'Location Added';
        res.locals.info = {
          functionName: 'AddLocation',
        };
        ResponseHandler.JSONSUCCESS(req, res);
      } else {
        throw new Error(Messages.AURTHORIZATION_ERROR);
      }
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'AddLocation-Error');
    }
  }

  public async deleteLocation(req: Request, res: Response): Promise<void> {
    try {
      const params: ILocationRequest = req.params;
      const location: LocationLib = new LocationLib();
      const user: UserLib = new UserLib();
      const userDetails: IUser = await user.getUserById(
        req.body.loggedinUserId,
      );
      if (userDetails.role === 'super_admin' || userDetails.role === 'admin') {
        const response: any = location.deletelocation(params.id);
        res.locals.data = response;
        res.locals.message = 'Location Deleted';
        res.locals.info = {
          functionName: 'DeleteLocation',
        };
        ResponseHandler.JSONSUCCESS(req, res);
      } else {
        throw new Error(Messages.AURTHORIZATION_ERROR);
      }
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'DeleteLocation-Error');
    }
  }

  public async fetchLocations(req: Request, res: Response): Promise<void> {
    try {
      const location: LocationLib = new LocationLib();

      const locations: any = await location.getAllCabins();
      res.locals.data = locations;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'FetchLocation-Error');
    }
  }

  public async fetchSpecificLocation(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const cabin: CabinLib = new CabinLib();
      const locationDetails: ICabin = await cabin.getCabinsFromLocation(
        req.params.location_id,
      );

      res.locals.data = locationDetails;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (err) {
      res.locals.data = err;
      ResponseHandler.JSONERROR(req, res, 'FetchLocation-Error');
    }
  }
  /**
   * Initialize the API registration for location module
   * { host/api/location }
   */
  private init(): void {
    const authHelper: AuthHelper = new AuthHelper();
    this.router.post('/', authHelper.guard, this.addLocation);
    this.router
      .delete('/:id', authHelper.guard, this.deleteLocation)
      .get('/:location_id', this.fetchSpecificLocation);
    this.router.get('/', this.fetchLocations);
  }
}
