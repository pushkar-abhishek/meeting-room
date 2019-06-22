import { PaginateResult } from 'mongoose';
import { IPagination } from '../abstractions/ApiResponses';

export class Utils {

    public getPaginateResponse<T>(response: PaginateResult<T>): IPagination {

        return ({
            total: response.total,
            limit: response.limit,
            page: response.page,
            pages: response.pages,
        });
    }
}
