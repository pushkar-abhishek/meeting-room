import * as crypto from 'crypto';
import { PaginateResult } from 'mongoose';
import { IPagination } from '../abstractions/ApiResponses';
/**
 * util class
 */
export class Utils {

    public getPaginateResponse<T>(response: PaginateResult<T>): IPagination {

        return ({
            total: response.total,
            limit: response.limit,
            page: response.page,
            pages: response.pages,
        });
    }

    public async getToken(): Promise<string> {
        const buffer: Buffer = await this.generateRandomBytes();

        return buffer.toString('hex');
    }

    public async generateRandomBytes(): Promise<any> {

        return crypto.randomBytes(16);
    }
}
