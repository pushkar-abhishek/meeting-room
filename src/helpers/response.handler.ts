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

        const errorCode: number = res.locals.statusCode || HttpStatus.BAD_REQUEST;
        obj = {
            success: false,
            details: res.locals.data,
            message: res.locals.data.message  || Messages.SOMETHING_BAD,
        };
        // error logs
        obj.functionName = apiName;
        showErrors ? obj : delete obj.details;
        res.status(errorCode).send(obj);
    }
}
