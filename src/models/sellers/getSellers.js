import knex from '../../knex';

const getSellers = () => knex('sellers').select().orderBy('id');

export default getSellers;
