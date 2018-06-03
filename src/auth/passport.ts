import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import User, { IUserModel } from "../models/User";
import { JWT_SECRET } from "../util/secrets";

passport.use(
  new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    session: false,
  }, async (email, password, cb) => {
    const user: IUserModel = await User.findOne({ "local.email": email });
    if (!user) {
      return cb(null, false, { message: "Incorrect email or password." });
    }

    const doPasswordsMatch = await user.comparePasswords(password);

    if (!doPasswordsMatch) {
      return cb(null, false, { message: "Incorrect email or password." });
    }

    return cb(null, user, { message: "Logged In Successfully" });
  }),
);

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
}, (jwtPayload, cb) => {
  cb(null, jwtPayload);
}));
