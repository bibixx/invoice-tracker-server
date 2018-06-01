import { Request, Response, NextFunction } from "express";
import Seller from "../models/Seller";
import User from "../models/User";

import { check, validationResult } from "express-validator/check";

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

const cEmail: any = check("email");

// name: "A",
// nip: "000000",
// city: "Warszawa",
// street: "Pisarka",
// zip: "03-984",
// seller: true,
// place: true,

export const postSellers = [
  [
    cEmail
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false })
      .withMessage("Email invalid"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
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
  },
];
