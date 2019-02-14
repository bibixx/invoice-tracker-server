import knex from '../knex';

export const createSeller = name => knex('sellers')
  .insert({
    name,
    city: 'B',
    streetAddress: 'C',
    nip: '123456789',
    zipCode: '00-911',
    isPlaceOfPurchase: true,
    isSeller: true,
  });

export const getSellers = () => knex('sellers').select();
