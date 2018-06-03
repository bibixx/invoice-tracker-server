import { Request, Response, NextFunction } from "express";
import passport from "passport";

import { sanitizeBody } from "express-validator/filter";
import { check, validationResult } from "express-validator/check";

import User, { IUserModel } from "../models/User";

const cEmail: any = check("email");
const cPassword: any = check("password");
const cPasswordConfirm: any = check("confirmPassword");

/**
 * POST /register
 * Register using email and password.
 */
export const register = [
  [
    cEmail
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false })
      .withMessage("Email invalid"),
    cPassword
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long"),
    cPasswordConfirm
      .isLength({ min: 5 })
      .custom((value: string, { req }: { req: Request }) => {
        if (value !== req.body.password) {
          return Promise.reject("Passwords must match");
        }
        return Promise.resolve();
      }),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next({ errors: errors.array(), status: 422 });
    }

    const user = new User({
      local: {
        password: req.body.password,
        email: req.body.email,
      },
    });

    try {
      await user.save();
      res.json({ ok: true });
    } catch (e) {
      if (e.code === 11000) {
        return next({
          errors: [
            {
              msg: "This email is already in use",
            },
          ],
          status: 422,
        });
      }

      return next({ errors: [e] });
    }
  },
];

/**
 * POST /login
 * Sign in using email and password.
 */
export const login = [
  [
    cEmail
      .isEmail(),
    cPassword
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err || !user) {
        return next({ errors: [{ msg: "Wrong email or password" }], status: 422 });
      }

      req.login(user, { session: false }, (err) => {
        const token: string = user.createToken();

        return res.json({ token, ok: true });
      });
    })(req, res);

    // return res.json({ token, ok: true });
  },
];
