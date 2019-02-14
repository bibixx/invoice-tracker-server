import knex from '../../knex';

const getSellerById = async (id) => {
  const sellersWithId = await knex.select().where({ id }).table('sellers');

  return sellersWithId[0];
};

export default getSellerById;
