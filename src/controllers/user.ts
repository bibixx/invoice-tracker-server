import { Request, Response, NextFunction } from "express";

import { sanitizeBody } from "express-validator/filter";
import { check, validationResult } from "express-validator/check";

import User, { IUserModel } from "../models/User";
import { IUserWithoutPassword } from "../interfaces/User";

import { createToken } from "../util/createToken";

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
      .normalizeEmail({ gmail_remove_dots: false }),
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
      })
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next({errors: errors.array(), status: 422});
    }

    const user = new User( {
      password: req.body.password,
      email: req.body.email,
    } );

    try {
      await user.save();
      res.json({ ok: true });
    } catch (e) {
      if (e.code === 11000) {
        return next( {
          errors: [
            {
              msg: "This email is already in use",
            }
          ]
        } );
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
    const user: IUserModel = await User.findOne({ email: req.body.email });

    if ( !user ) {
      return next({ errors: [{ msg: "User doesn't exist" }], status: 422 });
    }

    const doPasswordsMatch = await user.comparePasswords(req.body.password);

    if ( !doPasswordsMatch ) {
      return next({ errors: [{ msg: "Wrong password" }], status: 422 });
    }

    const userData: IUserWithoutPassword = {
      _id: user._id,
      email: user.email
    };

    const token: string = createToken(userData);

    return res.json({ ok: true, token });
  }
];
