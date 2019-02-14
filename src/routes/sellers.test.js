/* eslint-disable global-require */
import request from 'supertest';
import { appWithRouter } from '../utils/tests/express';
import { fakeSellers } from '../utils/tests/fakes/sellers';
import router from './sellers';

jest.mock('../models/sellers', () => ({
  getSellers: jest.fn(),
  getSellerById: jest.fn(),
  createSeller: jest.fn(),
}));

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

afterEach(() => {
  jest.clearAllMocks();
});

describe('/sellers', () => {
  describe('GET /', () => {
    it('should return all sellers', async () => {
      const getSpy = require('../models/sellers').getSellers;
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
      const id = Number(1);
      const getSpy = require('../models/sellers').getSellerById;
      getSpy.mockImplementation(() => fakeSellers[0]);

      const result = await request(app).get(`/${id}`);

      expect(result.status).toBe(200);
      expect(
        result.body,
      ).toEqual(
        {
          data: [{
            type: 'seller',
            id,
            attributes: omit('id')(fakeSellers[0]),
          }],
        },
      );

      expect(getSpy).toHaveBeenCalledWith(id);
    });
  });

  describe('POST /', () => {
    it('should create new seller', async () => {
      const createSpy = require('../models/sellers').createSeller;

      await request(app)
        .post('/')
        .send({
          data: {
            type: 'seller',
            attributes: fakeSellers[0],
          },
        });

      expect(createSpy).toHaveBeenCalledTimes(1);
    });

    it('should return data with type seller', async () => {
      const createSpy = require('../models/sellers').createSeller;

      const resp = await request(app)
        .post('/')
        .send({
          data: {
            type: 'seller',
            attributes: fakeSellers[0],
          },
        });

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(resp.body.id);
    });

    it('should return valid seller', () => {

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
