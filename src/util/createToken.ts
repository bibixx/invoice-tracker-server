import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../util/secrets";

export const createToken =
  (userData: String|Object|Buffer): string =>
  jwt.sign(userData, JWT_SECRET);
