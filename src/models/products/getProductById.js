import knex from '../../knex';

const getProducts = async (id) => {
  const [product] = await knex('products').where({ id }).select();

  return product;
};

export default getProducts;
