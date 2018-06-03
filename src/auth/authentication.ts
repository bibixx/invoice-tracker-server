import passport from "passport";
import { Request, Response, NextFunction } from "express";

const authenticate = (req: Request, res: Response, next: NextFunction) =>
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (info instanceof Error) {
      return next({ errors: [{ msg: info.message }], status: 401 });
    }

    req.user = user;

    return next();
  })(req, res, next);

export default authenticate;
