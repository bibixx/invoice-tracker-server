import { Request, Response, NextFunction } from "express";
import Seller from "../models/Seller";

export const getSellers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellers = await Seller.find(
      {
        owner: {
          $in: [req.user._id]
        }
      }
    );

    res.json({ ok: true, sellers });
  } catch (e) {
    next({ errors: [ {msg: e} ] });
  }
};