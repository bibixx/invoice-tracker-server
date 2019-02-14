import knex from '../../knex';
import createProduct from './createProduct';
import { fakeProducts } from '../../utils/tests/fakes/products';
import { fakeSellers } from '../../utils/tests/fakes/sellers';
import { truncate } from '../../utils/tests/pg';

afterEach(async () => {
  await truncate('products');
  await truncate('sellers');
});

afterAll(async () => {
  await knex.destroy();
});

describe('createProduct model', () => {
  beforeEach(async () => {
    await Promise.all(
      fakeSellers.map(seller => knex('sellers').insert(seller)),
    );
  });

  it('should create the product', async () => {
    await createProduct(fakeProducts[0]);

    const [newProduct] = await knex('products').select();
    expect(newProduct).toEqual(fakeProducts[0]);
  });
});
