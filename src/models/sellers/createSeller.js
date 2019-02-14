import knex from '../../knex';

const createSeller = ({
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

export default createSeller;
