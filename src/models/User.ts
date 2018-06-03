import jwt from "jsonwebtoken";
import { Document, Schema, Model, model, Error } from "mongoose";
import bcrypt from "bcrypt-nodejs";
import { BCRYPT_ROUNDS, JWT_SECRET } from "../util/secrets";
import { IUser } from "../interfaces/User";
import { IUserModel } from "./User";

export interface IUserModel extends IUser, Document {
  comparePasswords: comparePasswordsFunction;
  createToken: createToken;
}

const userSchema: Schema = new Schema({
  local: {
    email: String,
    password: String,
  },
});

export type comparePasswordsFunction = (passwordToCheck: string) => Promise<{}>;
export type createToken = () => string;

const comparePasswords: comparePasswordsFunction = async function (passwordToCheck) {
  const user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(passwordToCheck, user.local.password, (err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(res);
    });
  });
};

const createToken: createToken = function () {
  const user = this;
  const userData = {
    _id: user._id,
    email: user.local.email,
  };

  return jwt.sign(userData, JWT_SECRET);
};

userSchema.methods.comparePasswords = comparePasswords;

userSchema.methods.createToken = createToken;

userSchema.pre("save", async function save(next: Function) {
  const user: IUserModel = <IUserModel>this;

  if (!user.isModified("local.password")) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    const hash = bcrypt.hash(user.local.password, salt, undefined, (err: Error, hash) => {
      if (err) { return next(err); }
      user.local.password = hash;
      next();
    });
  });
});

const User: Model<IUserModel> = model<IUserModel>("User", userSchema);
export default User;
