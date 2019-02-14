import knex from '../../knex';
import getSellerById from './getSellerById';
import { fakeSellers } from '../../utils/tests/fakes/sellers';
import { truncate } from '../../utils/tests/pg';

afterEach(async () => {
  await truncate('sellers');
});

afterAll(async () => {
  await knex.destroy();
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
