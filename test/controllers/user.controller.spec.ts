import { expect } from 'chai';
import * as dotenv from 'dotenv';
import * as http from 'http';
import * as request from 'supertest';
import { App } from './../../App';
import { logger } from './../../src/logger';

dotenv.config({
  path: '.env.test',
});

let app: http.Server;
before(() => {
  app = new App().httpServer;
  app.on('error', function(): void {
    logger.log('testing server ');
  });
  app.on('listening', function(): void {
    logger.info('testing server started');
  });
  app.listen(process.env.PORT);
});

describe('User module', () => {

  describe('"usercontroller.getUsers()"', () => {

    it('should should list users', async () => {

        try {
          const users: any = await request(app)
            .get('/api/users');

          logger.info(JSON.stringify({'jso data': users}));
        } catch (err) {
            logger.log('err: ::', err)
            expect(err.statusCode).to.be.equal(401); // this is called
        }
    });
  });
});
