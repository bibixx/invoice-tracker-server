import knex from './knex';

(async () => {
  await knex('sellersAndPlaces').insert({
    name: "Media Saturn Online Sp. z o.o.",
    city: "Warszawa",
    streetAddress: 'Al. Jerozolimskie 179',
    nip: '1132470708',
    zipCode: "02-222",
    isPlaceOfPurchase: true,
    isSeller: true,
  });

  console.log(await knex.select('name', 'streetAddress').from('sellersAndPlaces'));
})();
