import knex from '../../knex';
import getProductById from './getProductById';
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

describe('getProductById model', () => {
  beforeEach(async () => {
    await Promise.all(
      fakeSellers.map(seller => knex('sellers').insert(seller)),
    );

    await Promise.all(
      fakeProducts.map(product => knex('products').insert(product)),
    );
  });

  it('should get correct product', async () => {
    const product = await getProductById(2);

    expect(product).toEqual(fakeProducts[1]);
  });

  it('should return undefined if product is not found', async () => {
    const product = await getProductById(20);

    expect(product).toEqual(undefined);
  });
});
