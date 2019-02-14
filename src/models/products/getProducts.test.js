import knex from '../../knex';
import getProducts from './getProducts';
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

describe('getProducts model', () => {
  beforeEach(async () => {
    await Promise.all(
      fakeSellers.map(seller => knex('sellers').insert(seller)),
    );

    await Promise.all(
      fakeProducts.map(product => knex('products').insert(product)),
    );
  });

  it('should return all products', async () => {
    const products = await getProducts();

    expect(products).toEqual(fakeProducts);
  });

  it('should return empty array if there are no products', async () => {
    await truncate('products');
    await truncate('sellers');

    const products = await getProducts();

    expect(products).toHaveLength(0);
  });
});
