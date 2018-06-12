import { Request, Response, NextFunction } from "express";

import SellerService from "./index";

/**
 * GET /sellers/
 * Get all sellers
 */
export const getSellers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellers = await SellerService.getSellers(req.user._id);

    res.json({ sellers, ok: true });
  } catch (e) {
    next({ errors: [{ msg: e }] });
  }
};

/**
 * GET /sellers/
 * Get all sellers
 */
export const getSellerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellers = await SellerService.getSellerById(req.user._id, req.params.sellerId);

    res.json({ sellers, ok: true });
  } catch (e) {
    next({ errors: [{ msg: e }] });
  }
};
