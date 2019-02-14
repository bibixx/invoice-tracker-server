import knex from '../knex';

export const createSeller = ({
  name,
  city,
  streetAddress,
  nip,
  zipCode,
  isPlaceOfPurchase,
  isSeller,
}) => knex('sellers')
  .insert({
    name,
    city,
    streetAddress,
    nip,
    zipCode,
    isPlaceOfPurchase,
    isSeller,
  });

export const getSellers = () => knex('sellers').select();
