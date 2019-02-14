import knex from '../../knex';

const getProducts = () => knex('products').select().orderBy('id');

export default getProducts;
