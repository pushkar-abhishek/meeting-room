import { Application, Request, Response } from 'express';
import { PaginateResult } from 'mongoose';
import { AuthHelper } from '../../helpers';
import { ResponseHandler, Utils } from '../../helpers';
import { BaseController } from '../BaseController';
import { IUser } from '../user/user.type';
import { Messages } from './../../constants';
import { UserLib } from '../user/user.lib';
import { CabinLib } from './cabin.lib';
import { LocationLib } from '../locations/location.lib';
import { ICabin, ICabinRequest } from './cabin.type';
import { ILocationRequest } from '../locations/location.type';

/**
 * Cabin Controller
 *
 */
export class CabinController extends BaseController {
    constructor() {
        super();
        this.init();
    }
    public register(express: Application): void {
        express.use('/api/cabin', this.router);
    }

    public async addCabin(req: Request, res: Response): Promise<void> {
        try {
            const data: ICabinRequest = req.body;
            const user: UserLib = new UserLib();
            const location: LocationLib = new LocationLib();
            const cabin: CabinLib = new CabinLib();
            const userDetails: IUser = await user.getUserById(req.body.loggedinUserId);
            if (userDetails.role === 'super_admin' || userDetails.role === 'admin') {
                const locationDetails: ILocationRequest = await location.getLocationById(req.params.location_id);
                if (locationDetails) {
                    if (req.query.add === 'true') {

                        data.location = locationDetails.id;
                        const result = await cabin.addCabin(data);
                        res.locals.data = result;
                        res.locals.message = 'Cabin Added';
                        res.locals.info = {
                            functionName: 'AddCabin',
                        };

                        ResponseHandler.JSONSUCCESS(req, res);
                    } else {
                        // ?add=false [ Fetch any availbale cabins]
                        const utils: Utils = new Utils();
                        const filters: any = { location: locationDetails.id };
                        const options: any = {
                            page: req.query.page ? Number(req.query.page) : 1,
                            limit: req.query.limit ? Number(req.query.limit) : 5,
                        };
                        const cabins: PaginateResult<ICabin> = await cabin.getAllCabins(filters, options);
                        res.locals.data = cabins.docs;
                        res.locals.pagination = utils.getPaginateResponse(cabins);
                        ResponseHandler.JSONSUCCESS(req, res);
                    }
                } else {
                    throw new Error(Messages.LOCATION_ERROR);
                }
            } else {
                throw new Error(Messages.AURTHORIZATION_ERROR);
            }
        } catch (err) {
            res.locals.data = err;
            ResponseHandler.JSONERROR(req, res, 'AddCabin-Error');
        }
    }

    public async deleteCabin(req: Request, res: Response): Promise<void> {
        try {
            const params: ICabinRequest = req.params;
            const user: UserLib = new UserLib();
            const cabin: CabinLib = new CabinLib();

            const userDetails: IUser = await user.getUserById(req.body.loggedinUserId);
            if (userDetails.role === 'super_admin' || userDetails.role === 'admin') {
                const response: any = cabin.delete(params.cabin_id);
                res.locals.data = response;
                res.locals.message = 'Cabin Deleted';
                res.locals.info = {
                    functionName: 'DeleteCabin',
                };
                ResponseHandler.JSONSUCCESS(req, res);
            } else {
                throw new Error(Messages.AURTHORIZATION_ERROR);
            }
        } catch (err) {
            res.locals.data = err;
            ResponseHandler.JSONERROR(req, res, 'DeleteCabin-Error');

        }
    }


    public async fetchSpecificCabin(req: Request, res: Response): Promise<void> {
        try {
            const cabin: CabinLib = new CabinLib();
            const details: ILocationRequest = await cabin.getCabin(req.params.cabin_id);
            res.locals.data = details;
            ResponseHandler.JSONSUCCESS(req, res);
        } catch (err) {
            res.locals.data = err;
            ResponseHandler.JSONERROR(req, res, 'FetchCabin-Error');
        }
    }

    /**
     * Initialize the API registration for cabin module
     * { host/api/cabin }
     */
    private init(): void {
        const authHelper: AuthHelper = new AuthHelper();
        this.router.post('/:location_id', authHelper.guard, this.addCabin);
        this.router.delete('/:cabin_id', authHelper.guard, this.deleteCabin);
        this.router.get('/:cabin_id', this.fetchSpecificCabin);
    }
}
