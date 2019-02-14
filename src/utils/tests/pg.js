import knex from '../../knex';

// eslint-disable-next-line import/prefer-default-export
export const truncate = table => knex.raw(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
