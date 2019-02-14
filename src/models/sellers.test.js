import knex from '../knex';
import { createSeller, getSellers, getSellerById } from './sellers';
import { fakeSellers } from '../utils/tests/fakes/sellers';
import { truncate } from '../utils/tests/pg';

afterEach(async () => {
  await truncate('sellers');
});

afterAll(async () => {
  await knex.destroy();
});

describe('sellers model', () => {
  describe('createSeller', () => {
    it('should create a seller with passed arguments', async () => {
      const seller = fakeSellers[0];

      await createSeller(seller);

      const [newSeller] = await knex('sellers').select();

      expect(newSeller).toEqual(seller);
    });
  });

  describe('getSellers', () => {
    beforeEach(async () => {
      await Promise.all(
        fakeSellers.map(seller => knex('sellers').insert(seller)),
      );
    });

    it('should return an array', async () => {
      const sellers = await getSellers();

      expect(Array.isArray(sellers)).toBe(true);
    });

    it('should return all sellers', async () => {
      const sellers = await getSellers();

      expect(sellers).toHaveLength(fakeSellers.length);
    });

    it('should return all fields of seller', async () => {
      const sellers = await getSellers();

      expect(
        Object.keys(sellers[0]),
      ).toEqual(
        Object.keys(fakeSellers[0]),
      );
    });
  });

  describe('getSellerById', () => {
    beforeEach(async () => {
      await Promise.all(
        fakeSellers.map(seller => knex('sellers').insert(seller)),
      );
    });

    it('should return proper seller', async () => {
      const seller = await getSellerById(1);

      expect(seller).toEqual(fakeSellers[0]);
    });

    it('should return undefined if seller not found', async () => {
      const seller = await getSellerById(999);

      expect(seller).toBe(undefined);
    });
  });
});
