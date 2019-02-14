import knex from '../knex';
import { createSeller, getSellers } from './sellers';

afterEach(async () => {
  await knex('sellers').delete();
});

describe('sellers controller', () => {
  describe('createSeller', () => {
    it('should create a seller with passed arguments', async () => {
      const seller = {
        name: 'Laskowski S.A.',
        city: 'Koszalin',
        streetAddress: 'ul. Chopina Fryderyka 149',
        nip: '1234567890',
        zipCode: '75-576',
        isPlaceOfPurchase: true,
        isSeller: true,
      };

      await createSeller(seller);

      const [{ id, ...newSeller }] = await knex('sellers').select();

      expect(newSeller).toEqual(seller);
    });
  });

  describe('getSellers', () => {
    const fakeSellers = [
      {
        name: 'Laskowski S.A.',
        city: 'Koszalin',
        streetAddress: 'ul. Chopina Fryderyka 149',
        nip: '1234567890',
        zipCode: '75-576',
        isPlaceOfPurchase: true,
        isSeller: true,
      },
      {
        name: 'Lis sp. z o.o.',
        city: 'Mysłowice',
        streetAddress: 'ul. Kochanowskiego Jana 75',
        nip: '0987654321',
        zipCode: '41-404',
        isPlaceOfPurchase: true,
        isSeller: false,
      },
    ];

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
        [
          'id',
          ...Object.keys(fakeSellers[0]),
        ],
      );
    });
  });
});
