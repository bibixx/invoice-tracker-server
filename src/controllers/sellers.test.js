import request from 'supertest';
import { appWithRouter } from '../utils/tests/express';

import knex from '../knex';
import router from './sellers';

const app = appWithRouter(router);

afterEach(async () => {
  await knex('sellers').delete();
});

describe('/sellers', () => {
  describe('GET', () => {
    it('should return all sellers', async () => {
      const sellerFactory = name => ({
        name,
        city: 'B',
        streetAddress: 'C',
        nip: '123456789',
        zipCode: '00-911',
        isPlaceOfPurchase: true,
        isSeller: true,
      });

      await knex('sellers').insert(sellerFactory('John'));
      await knex('sellers').insert(sellerFactory('Doe'));

      const result = await request(app).get('/');

      expect(result.status).toBe(200);
      expect(result.body.sellers).toHaveLength(2);
    });
  });

  describe('POST', () => {
    it('should create new seller', async () => {
      const name = 'John';
      await request(app)
        .post('/')
        .send({
          name,
        })
        .expect(201);

      const sellers = await knex('sellers').select('name');

      expect(sellers).toHaveLength(1);
      expect(
        sellers[0].name,
      ).toBe(name);
    });
  });
});
