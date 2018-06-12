import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
  // logger.debug("Using .env file to supply config environment variables");
  dotenv.config({ path: ".env" });
} else {
  // logger.debug("Using .env.example file to supply config environment variables");
  dotenv.config({ path: ".env.example" });
}
export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production";
const test = ENVIRONMENT === "test";

export const JWT_SECRET = process.env["JWT_SECRET"];
export const BCRYPT_ROUNDS = +process.env.BCRYPT_ROUNDS;

export const MONGODB_URI = prod ?
  process.env["MONGODB_URI"] :
  test ?
    process.env["MONGODB_URI_TEST"] :
    process.env["MONGODB_URI_LOCAL"];

if (!JWT_SECRET) {
  logger.error("No client secret. Set JWT_SECRET environment variable.");
  process.exit(1);
}

if (!MONGODB_URI) {
  logger.error("No mongo connection string. Set MONGODB_URI environment variable.");
  process.exit(1);
}
