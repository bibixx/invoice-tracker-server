import request from 'supertest';
import * as sellersModel from '../models/sellers';
import { appWithRouter } from '../utils/tests/express';

import router from './sellers';

const app = appWithRouter(router);

const omit = keyToOmit => obj => Object.entries(obj).reduce((prev, [key, value]) => {
  if (key !== keyToOmit) {
    return {
      ...prev,
      [key]: value,
    };
  }

  return prev;
}, {});

describe('/sellers', () => {
  const fakeSellers = [
    {
      id: '0',
      name: 'Laskowski S.A.',
      city: 'Koszalin',
      streetAddress: 'ul. Chopina Fryderyka 149',
      nip: '1234567890',
      zipCode: '75-576',
      isPlaceOfPurchase: true,
      isSeller: true,
    },
    {
      id: '1',
      name: 'Lis sp. z o.o.',
      city: 'Mysłowice',
      streetAddress: 'ul. Kochanowskiego Jana 75',
      nip: '0987654321',
      zipCode: '41-404',
      isPlaceOfPurchase: true,
      isSeller: false,
    },
  ];

  describe('GET /', () => {
    it('should return all sellers', async () => {
      const getSpy = jest.spyOn(sellersModel, 'getSellers');
      getSpy.mockImplementation(() => fakeSellers);

      const result = await request(app).get('/');
      const { body } = result;

      expect(result.status).toBe(200);

      const omitId = omit('id');

      expect(body).toEqual({
        data: fakeSellers.map(seller => ({
          type: 'seller',
          id: seller.id,
          attributes: omitId(seller),
        })),
      });
    });
  });

  describe('GET /:id/', () => {
    it('should return proper seller', async () => {
      const id = 0;

      const getSpy = jest.spyOn(sellersModel, 'getSellerById');
      getSpy.mockImplementation(() => fakeSellers[0]);

      const result = await request(app).get(`/${id}`);

      expect(result.status).toBe(200);
      expect(
        result.body,
      ).toEqual(
        {
          data: [{
            type: 'seller',
            id: '0',
            attributes: omit('id')(fakeSellers[0]),
          }],
        },
      );

      expect(getSpy).toHaveBeenCalledWith(id);
    });
  });

  describe('POST /', () => {
    it('should create new seller', async () => {
      const createSpy = jest.spyOn(sellersModel, 'createSeller');

      await request(app)
        .post('/')
        .send({
          data: {
            type: 'seller',
            attributes: fakeSellers[0],
          },
        })
        .expect(201);

      expect(createSpy).toHaveBeenCalledTimes(1);
    });

    describe.skip('validation', () => {
      const [seller] = fakeSellers;

      it.each([
        'name',
        'city',
        'streetAddress',
        'nip',
        'zipCode',
        'isPlaceOfPurchase',
        'isSeller',
      ])('should return error if %s is not present', (keyToOmit) => {
        console.log(Object.keys(omit(keyToOmit)(seller)));
      });
    });
  });
});
