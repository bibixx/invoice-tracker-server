import knex from '../../knex';
import createSeller from './createSeller';
import { fakeSellers } from '../../utils/tests/fakes/sellers';
import { truncate } from '../../utils/tests/pg';

afterEach(async () => {
  await truncate('sellers');
});

afterAll(async () => {
  await knex.destroy();
});

describe('createSeller model', () => {
  it('should create a seller with passed arguments', async () => {
    const seller = fakeSellers[0];

    await createSeller(seller);

    const [newSeller] = await knex('sellers').select();

    expect(newSeller).toEqual(seller);
  });
});
