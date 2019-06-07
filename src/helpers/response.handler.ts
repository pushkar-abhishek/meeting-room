import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as _ from 'lodash';
import { IStandardErrorResponse, IStandardSuccessResponse } from '../abstractions/ApiResponses';
import { Messages } from '../constants';

// tslint:disable-next-line:no-unnecessary-class
export class ResponseHandler {

    public static JSONSUCCESS(req: Request, res: Response): void {

        const obj: IStandardSuccessResponse = {
            success: true,
            data: res.locals.data,
            pagination: res.locals.pagination,
            message: res.locals.message || Messages.SUCCESSFULLT_RECIEVED,
        };

        res.status(HttpStatus.OK).jsonp(obj);
    }

    public static JSONERROR(req: Request, res: Response, apiName: string): void {

        let obj: IStandardErrorResponse;
        const showErrors: boolean = ['production', 'prod'].indexOf(process.env.NODE_ENV) > 0 ? false : true;
        const err: any = res.locals.data || {};
        const details: any = res.locals.details ? {
            message : res.locals.details.message,
            stack : res.locals.details.stack,
        } : null ;
        const errorCode: number = res.locals.errorCode || HttpStatus.BAD_REQUEST;
        if (err && err.name === 'ValidationError') {

            const errors: any = {};

            _.forOwn(err.errors, (value: any, key: any) => {
                errors[key] = _.pick(value, 'message');
            });
            obj = {
                success: false,
                error: errors,
                details: details,
                message: err.message,
                request: {
                    ip: req.connection.remoteAddress,
                    browserAgent: req.headers['user-agent'],
                    username: (req.body && req.body.logginedUser ? req.body.logginedUser.username : ''),
                    name: (req.body && req.body.logginedUser ? req.body.logginedUser.name : ''),
                },

            };

            obj.functionName = apiName;
            showErrors ? obj : delete obj.details;
            res.status(errorCode).send(obj);
        } else {
            obj = {
                success: false,
                details: details,
                error: err.error || err,
                message: err.message || Messages.SOMETHING_BAD,
            };
            // error logs
            obj.functionName = apiName;
            showErrors ? obj : delete obj.details;
            res.status(errorCode).send(obj);
        }
    }
}
