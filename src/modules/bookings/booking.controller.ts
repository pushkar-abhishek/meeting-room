import { Application, Request, Response } from 'express';
import moment = require('moment');
import mtz = require('moment-timezone');
import { AuthHelper, ResponseHandler, EmailServer } from '../../helpers';
import { BaseController } from '../BaseController';
import { CabinLib } from '../cabins/cabin.lib';
import { ICabin } from '../cabins/cabin.type';
import { UserLib } from '../user/user.lib';
import { IUser } from '../user/user.type';
import { Messages } from './../../constants';
import { BookingLib } from './booking.lib';
import { IBooking, IBookingRequest } from './booking.type';

/**
 * Booking Controller
 *
 */
export class BookingController extends BaseController {
    constructor() {
        super();
        this.init();
    }

    public register(express: Application): void {
        express.use('/api/book', this.router);
    }

    public async bookACabin(req: Request, res: Response): Promise<void> {
        try {
            const data: IBookingRequest = req.body;
            const user: UserLib = new UserLib();
            const booking: BookingLib = new BookingLib();
            const cabin: CabinLib = new CabinLib();
            const mailer: EmailServer = new EmailServer();
            const userDetails: IUser = await user.getUserById(
                req.body.loggedinUserId,
            );
            const mailingArray: string[] = []

            const date: string = data.booking_date ? data.booking_date : Date.now();
            const cabinId: string = req.params.cabin_id;
            data.cabin = cabinId;
            data.location = req.params.location_id;
            data.occupied_by = userDetails._id;
            data.booking_date = date;
            const result: IBooking = await booking.addBooking(data);
            const bookingCabin: ICabin = await cabin.getCabin(cabinId);
            await cabin.arrayPush(cabinId, result._id);
            res.locals.data = result;
            res.locals.message = 'Booked';
            res.locals.info = {
                functionName: 'bookACabin',
            };
            ResponseHandler.JSONSUCCESS(req, res);

            mailingArray.push(userDetails.email)
            data.mails.forEach(function (item: any) {
                mailingArray.push(item)
            });
            mailingArray.forEach(async function (i) {
                const options: any = {
                    subject: 'Meeting Invitation',
                    templateName: 'invitation',
                    to: i,
                    replace: {
                        roomName: bookingCabin.name,
                        purpose: result.purpose,
                        duration: result.duration,
                        startTime: moment.utc(result.start_time).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                    }
                };

                await mailer.sendEmail(options);
            })
        } catch (err) {
            res.locals.data = err;
            ResponseHandler.JSONERROR(req, res, 'Booking-Error');
        }
    }

    public async seeAvailable(req: Request, res: Response): Promise<void> {
        try {
            const cabin: CabinLib = new CabinLib();
            const location: string = req.params.location_id;
            const start: string = mtz
                .tz(
                    moment(req.body.start_time)
                        .startOf('day')
                        .toDate(),
                    req.body.timezone,
                )
                .utc()
                .format();
            const end: string = mtz
                .tz(
                    moment(req.body.end_time)
                        .endOf('day')
                        .toDate(),
                    req.body.timezone,
                )
                .utc()
                .format();

            const result: ICabin[] = await cabin.checkAvailable(location, start, end);

            res.locals.data = result;
            res.locals.message = 'Booked';
            res.locals.info = {
                functionName: 'Booking',
            };
            ResponseHandler.JSONSUCCESS(req, res);
        } catch (err) {
            res.locals.data = err;
            ResponseHandler.JSONERROR(req, res, 'Booking-Error');
        }
    }

    /**
     * API to cancel the booked meeting
     * @param req
     * @param res
     */
    public async cancelBooking(req: Request, res: Response): Promise<void> {
        try {
            const booking: BookingLib = new BookingLib();
            const cabin: CabinLib = new CabinLib();

            const booking_id: string = req.params.booking_id;

            const bookedCabin: IBooking = await booking.myBooking(booking_id);

            const pullBookingFromCabin: ICabin = await cabin.pullBooking(
                bookedCabin.cabin,
                booking_id,
            );
            const result: IBooking = await booking.cancelBooking(booking_id);

            res.locals.data = result;
            res.locals.message = 'Booking Cancelled';
            res.locals.info = {
                functionName: 'cancelBooking',
            };
            ResponseHandler.JSONSUCCESS(req, res);
        } catch (err) {
            res.locals.data = err;
            ResponseHandler.JSONERROR(req, res, 'Booking-Cancellation-Error');
        }
    }

    /**
     * Initialize the API registration for booking module
     * { host/api/book }
     */
    private init(): void {
        const authHelper: AuthHelper = new AuthHelper();
        this.router.post(
            '/:location_id/:cabin_id',
            authHelper.guard,
            this.bookACabin,
        );
        this.router.post('/:location_id', authHelper.guard, this.seeAvailable);
        this.router.get('/:booking_id', authHelper.guard, this.cancelBooking);
    }
}
