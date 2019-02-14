import knex from '../../knex';

const getProducts = () => knex('products').select();

export default getProducts;
