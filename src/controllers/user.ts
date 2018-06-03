import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { validationResult, checkSchema } from "express-validator/check";

import User from "../models/User";

const registerSchema = {
  email: {
    isEmail: true,
    errorMessage: "Email invalid",
    normalizeEmail: {
      options: {
        gmail_remove_dots: false,
      },
    },
  },
  password: {
    isLength: {
      errorMessage: "Password should be at least 7 chars long",
      options: { min: 7 },
    },
  },
  confirmPassword: {
    custom: {
      options: (value: string, { req }: { req: Request }) => {
        if (value !== req.body.password) {
          return Promise.reject("Passwords must match");
        }
        return Promise.resolve();
      },
    },
  },
};

const loginSchema = {
  email: {
    isEmail: true,
    errorMessage: "Email invalid",
    normalizeEmail: {
      options: {
        gmail_remove_dots: false,
      },
    },
  },
  password: {
    isLength: {
      errorMessage: "Password should be at least 7 chars long",
      options: { min: 7 },
    },
  },
};

/**
 * POST /register
 * Register using email and password.
 */
export const register = [
  checkSchema(registerSchema as any),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next({ errors: errors.array(), status: 422 });
    }

    const userWithEmail = await User.findOne({ "local.email": req.body.email });

    if (userWithEmail !== null) {
      return next({
        errors: [
          {
            msg: "This email is already in use",
          },
        ],
        status: 422,
      });
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
      return next({ errors: [e] });
    }
  },
];

/**
 * POST /login
 * Sign in using email and password.
 */
export const login = [
  checkSchema(loginSchema as any),
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
  },
];
