import express from 'express';
import bodyParser from 'body-parser';

import knex from './knex';

const { EXPRESS_PORT, NODE_ENV } = process.env;

const app = express();
app
  .use(bodyParser.json())
  .post('/ping', async (req, res) => {
    await knex('sellersAndPlaces')
      .insert({
        name: req.body.name,
        city: 'B',
        streetAddress: 'C',
        nip: '123456789',
        zipCode: '00-911',
        isPlaceOfPurchase: true,
        isSeller: true,
      });

    res.status(200).send('pong');
  });

if (NODE_ENV !== 'test') {
  app.listen(EXPRESS_PORT, () => {
    console.log(`App listening on port ${EXPRESS_PORT}`);
  });
}

export default app;
