import knex from 'knex';

const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_PASSWORD } = process.env;

export default knex({
  client: 'pg',
  connection: {
    user: 'postgres',
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
  },
});
