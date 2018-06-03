import { Types } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { validationResult, checkSchema } from "express-validator/check";

import Seller from "../models/Seller";
import User from "../models/User";
import { isNip } from "../util/isNip";

const postSchema = {
  name: {
    isEmpty: {
      negated: true,
    },
    trim: true,
  },
  nip: {
    isEmpty: {
      negated: true,
    },
    custom: {
      options: isNip,
    },
  },
  city: {
    isEmpty: {
      negated: true,
    },
    trim: true,
  },
  street: {
    isEmpty: {
      negated: true,
    },
    trim: true,
  },
  zip: {
    isEmpty: {
      negated: true,
    },
    trim: true,
  },
  seller: {
    isBoolean: {
      errorMessage: "Seller should be a boolean",
    },
  },
  place: {
    isBoolean: {
      errorMessage: "Place should be a boolean",
    },
  },
};

const putSchema = {
  ...Object.entries(postSchema).reduce((prev, [key, value]) => {
    const newValue = {
      ...value,
      optional: true,
    };

    return { ...prev, [key]: newValue };
  }, {}),
  id: {
    isEmpty: {
      negated: true,
    },
    custom: {
      options: (v: string): boolean => Types.ObjectId.isValid(v),
      errorMessage: "Specified id is not a valid id",
    },
  },
};

const deleteSchema = {
  id: {
    isEmpty: {
      negated: true,
    },
    custom: {
      options: (v: string): boolean => Types.ObjectId.isValid(v),
      errorMessage: "Specified id is not a valid id",
    },
  },
};

/**
 * GET /sellers/:id
 * Get all sellers
 */
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

/**
 * POST /sellers/
 * Create seller
 */
export const postSellers = [
  checkSchema(postSchema as any),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next({ errors: errors.array(), status: 422 });
    }

    const user = await User.findById(Types.ObjectId(req.user._id));

    const seller = new Seller({
      owner: user,
      name: req.body.name,
      nip: req.body.nip,
      city: req.body.city,
      street: req.body.street,
      zip: req.body.zip,
      seller: req.body.seller,
      place: req.body.place,
    });

    await seller.save();

    res.json({ ok: true });
  },
];

/**
 * PUT /sellers/:id
 * Edit seller
 */
export const putSellers = [
  checkSchema(putSchema as any),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next({ errors: errors.array(), status: 422 });
    }

    const id = Types.ObjectId(req.params.id);
    const seller = await Seller.findById(id);

    if (!seller) {
      return next({ errors: [{ msg: "Seller with specifed id does not exist" }], status: 422 });
    }

    const whitelistedValues = Object.keys(putSchema);
    const values = Object.entries(req.body).reduce((prev, [key, value]) => {
      if (whitelistedValues.includes(key)) {
        return {
          ...prev,
          [key]: value,
        };
      }

      return prev;
    }, {});

    await Seller.findByIdAndUpdate(id, values);

    res.json({ ok: true });
  },
];

/**
 * DELETE /sellers/:id
 * Delete seller
 */
export const deleteSellers = [
  checkSchema(deleteSchema as any),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next({ errors: errors.array(), status: 422 });
    }

    const id = Types.ObjectId(req.params.id);

    const seller = await Seller.findById(id);

    if (!seller) {
      return next({ errors: [{ msg: "Seller with specifed id does not exist" }], status: 422 });
    }

    await seller.remove();

    res.json({ ok: true });
  },
];
