import { expect } from 'chai';
import * as request from 'supertest';
import { App } from './../../App';
import { logger } from './../../src/logger';
let app: App;
before(() => {
  app = new App();
});

describe('User module', () => {

  describe('"usercontroller.getUsers()"', () => {

    it('should should list users', async () => {

        const options: object = {
          url: 'localhost:3000/api/',
          resolveWithFullResponse: true,
        };

        try {
          const users: any = await request(app)
            .get('/users');

          logger.info(JSON.stringify({'jso data': users}));
        } catch (err) {
            expect(err.statusCode).to.be.equal(401); // this is called
        }
    });
  });
});
