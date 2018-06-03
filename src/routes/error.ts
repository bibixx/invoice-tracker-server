import express, { Request, Response, NextFunction } from "express";

type errorObject = {
  status: number,
  errors: object[],
};

const handleError = (err: errorObject, req: Request, res: Response, next: NextFunction) => {
  res
    .status(err.status || 500)
    .json({
      ok: false,
      errors: err.errors,
    });
};

export default handleError;
