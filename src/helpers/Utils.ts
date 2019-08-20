import * as crypto from 'crypto';
import { PaginateResult } from 'mongoose';
import * as speakeasy from 'speakeasy';
import { IPagination } from '../abstractions/ApiResponses';
// import * as Nexmo from 'nexmo';

// const nexmo: any = new Nexmo({
//   apiKey: "7f80f707",
//   apiSecret: "YwIMSVqH3nrgVu1d"
// }, { debug: true });

/**
 * Utils
 */
export class Utils {
  public getPaginateResponse<T>(response: PaginateResult<T>): IPagination {
    return {
      total: response.total,
      limit: response.limit,
      page: response.page,
      pages: response.pages,
    };
  }

  public async getToken(): Promise<string> {
    const buffer: Buffer = await this.generateRandomBytes();

    return buffer.toString('hex');
  }

  public async generateRandomBytes(): Promise<any> {
    return crypto.randomBytes(16);
  }

  public async  generateOtp(): Promise<any> {
    return speakeasy.totp({
      secret: speakeasy.generateSecret({ length: 20 }).base32,
      encoding: 'base32',
      digits: 4,
      step: 240,
    });
  }
}
