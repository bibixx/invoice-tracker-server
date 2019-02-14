import { createSeller, getSellers, getSellerById } from '../models/sellers';

const formatSeller = ({ id, ...sellerAttribures }) => ({
  type: 'seller',
  ...(id && { id: Number(id) }),
  attributes: sellerAttribures,
});

export const createSellerPost = async (req, res) => {
  const {
    data: {
      attributes: seller,
      attributes: {
        name,
        city,
        streetAddress,
        nip,
        zipCode,
        isPlaceOfPurchase,
        isSeller,
      },
    },
  } = req.body;

  await createSeller({
    name,
    city,
    streetAddress,
    nip,
    zipCode,
    isPlaceOfPurchase,
    isSeller,
  });

  res.status(201).json({
    data: formatSeller(seller),
  });
};

export const getSellersGet = async (req, res) => {
  const sellers = await getSellers();

  res.status(200).json({
    data: sellers.map(formatSeller),
  });
};

export const getSellerByIdGet = async (req, res) => {
  const id = Number(req.params.id);
  const seller = await getSellerById(id);

  res.status(200).json({
    data: [
      formatSeller(seller),
    ],
  });
};
