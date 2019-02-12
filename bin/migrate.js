#!/usr/bin/env node
const migrate = require('node-pg-migrate');
const path = require('path');

const { POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_DB } = process.env;

let failsCount = 0;

const run = async () => {
  try {
    await migrate({
      databaseUrl: `postgres://postgres:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/${POSTGRES_DB}`,
      dir: path.join(__dirname, '../migrations'),
      direction: 'up',
      migrationsTable: 'migrations',
    });
  } catch (error) {
    failsCount += 1;
    console.log(error);

    if (failsCount < 20) {
      setTimeout(() => run(), 1000);
    }
  }
};

run();
