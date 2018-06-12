import jwt from "jsonwebtoken";
import { Document, Schema, Model, model, Error } from "mongoose";
import { JWT_SECRET, BCRYPT_ROUNDS } from "../util/secrets";
import { IUser } from "./user.interface";
import { IUserModel } from "./user.model";
import { genHash, genSalt, compare } from "../util/bcrypt";

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

  return compare(passwordToCheck, user.local.password);
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

  if (!user.isModified("local.password")) {
    return next();
  }

  try {
    const salt = await genSalt();
    const hash = await genHash(user.local.password, salt);
    user.local.password = hash;
    return next();
  } catch (e) {
    return next(e);
  }
});

const User: Model<IUserModel> = model<IUserModel>("User", userSchema);
export default User;
