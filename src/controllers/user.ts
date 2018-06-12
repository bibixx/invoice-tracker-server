import { Request, Response, NextFunction } from "express";
import passport from "passport";

import UserService from "../User/";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await UserService.createUser(
      req.body.email, req.body.password, req.body.passwordConfirm,
    );

    res.json({
      ok: true,
      data: newUser,
    });
  } catch (err) {
    next({
      status: 422,
      errors: err.errors,
    });
  }
};

/**
 * POST /login
 * Sign in using email and password.
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", { session: false }, (err, user) => {
    if (err || !user) {
      return next({ errors: [{ msg: "Wrong email or password" }], status: 422 });
    }

    req.login(user, { session: false }, (err) => {
      const token: string = user.createToken();

      return res.json({ token, ok: true });
    });
  })(req, res);
};