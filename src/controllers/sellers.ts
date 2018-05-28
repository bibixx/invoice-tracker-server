import { Request, Response, NextFunction } from "express";
import Seller from "../models/Seller";
import User from "../models/User";

export const getSellers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellers = await Seller.find(
      {
        owner: {
          $in: [req.user._id],
        },
      },
    );

    res.json({ sellers, ok: true });
  } catch (e) {
    next({ errors: [{ msg: e }] });
  }
};

export const postSellers = async (req: Request, res: Response, next: NextFunction) => {
  const users = await User.find({});

  const sellerMock = [
    new Seller({
      owner: users[0],
      name: "A",
      nip: "000000",
      city: "Warszawa",
      street: "Pisarka",
      zip: "03-984",
      seller: true,
      place: true,
    }),
    new Seller({
      owner: users[0],
      name: "A",
      nip: "000001",
      city: "Warszawa",
      street: "Pisarka",
      zip: "03-984",
      seller: true,
      place: true,
    }),
  ];

  await Promise.all(sellerMock.map(s => s.save()));

  res.json({});
};
