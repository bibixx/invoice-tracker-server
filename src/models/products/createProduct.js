import knex from '../../knex';

const createProduct = ({
  name,
  warrantyLength,
  placeOfPurchase,
  seller,
  boughtAt,
}) => knex('products')
  .insert({
    name,
    warrantyLength,
    placeOfPurchase,
    seller,
    boughtAt,
  });

export default createProduct;
