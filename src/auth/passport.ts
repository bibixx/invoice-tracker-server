import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { JWT_SECRET } from "../util/secrets";
import UserService from "../User/";

passport.use(
  new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    session: false,
  }, async (email, password, cb) => {
    try {
      const user = await UserService.login(email, password);

      return cb(null, user, { message: "Logged In Successfully" });
    } catch (err) {
      return cb(null, false, { message: err.message });
    }
  }),
);

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
}, (jwtPayload, cb) => {
  cb(null, jwtPayload);
}));
