import request from 'supertest';
import knex from './knex';
import app from './index';

afterEach(async () => {
  await knex('sellersAndPlaces').delete();
});

describe('/ping', () => {
  it('should add John name', async () => {
    const name = 'John';
    await request(app)
      .post('/ping')
      .send({
        name,
      })
      .expect(200)
      .expect('pong');

    const sellers = await knex('sellersAndPlaces').select('name');

    expect(sellers).toHaveLength(1);
    expect(
      sellers[0].name,
    ).toBe(name);
  });

  it('should add Mark name', async () => {
    const name = 'Mark';
    await request(app)
      .post('/ping')
      .send({
        name,
      })
      .expect(200)
      .expect('pong');

    const sellers = await knex('sellersAndPlaces').select('name');

    expect(sellers).toHaveLength(1);
    expect(
      sellers[0].name,
    ).toBe(name);
  });
});
