import express from 'express';
import bodyParser from 'body-parser';

import router from './controllers';

const { EXPRESS_PORT, NODE_ENV } = process.env;

const app = express();
app
  .use(bodyParser.json())
  .use('/', router);

if (NODE_ENV !== 'test') {
  app.listen(EXPRESS_PORT, () => {
    console.log(`App listening on port ${EXPRESS_PORT}`);
  });
}

export default app;
