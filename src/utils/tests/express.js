import express from 'express';
import bodyParser from 'body-parser';

// eslint-disable-next-line import/prefer-default-export
export const appWithRouter = router => express()
  .use(bodyParser.json())
  .use('/', router);
