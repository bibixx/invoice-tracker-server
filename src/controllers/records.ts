import { Request, Response, NextFunction } from "express";

export const getRecords = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ ok: true });
};