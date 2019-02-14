import knex from '../../knex';
import getSellers from './getSellers';
import { fakeSellers } from '../../utils/tests/fakes/sellers';
import { truncate } from '../../utils/tests/pg';

afterEach(async () => {
  await truncate('sellers');
});

afterAll(async () => {
  await knex.destroy();
});

describe('getSellers model', () => {
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
