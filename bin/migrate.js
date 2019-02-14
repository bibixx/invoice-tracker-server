#!/usr/bin/env node
const migrate = require('node-pg-migrate');
const path = require('path');

const { POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_DB } = process.env;

let failsCount = 0;

// eslint-disable-next-line consistent-return
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

    console.log(`Fail ${failsCount} / 20`);
    if (failsCount < 20) {
      return setTimeout(() => run(), 1000);
    }

    console.log(error);
  }
};

run();
