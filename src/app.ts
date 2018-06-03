import express, { Request, Response, NextFunction } from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import logger from "./util/logger";
import path from "path";
import jwt from "express-jwt";
import lusca from "lusca";
import dotenv from "dotenv";
import mongoose from "mongoose";
// import bluebird from "bluebird";

import { MONGODB_URI, JWT_SECRET } from "./util/secrets";

import * as apiController from "./controllers/api";
import * as userController from "./controllers/user";
import * as recordsController from "./controllers/records";
import * as sellersController from "./controllers/sellers";
import "./auth/passport";
import passport from "passport";

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env.example" });

// Create Express server
const app = express();

// Connect to MongoDB

(<any>mongoose).Promise = global.Promise;

const MONGODB_URI_TEST = "mongodb://localhost:27017/invoice-test";

mongoose.connect(MONGODB_URI_TEST)
.catch((err) => {
  console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
});

// Express configuration
app.set("port", process.env.PORT || 3000);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

app.get("/ping", apiController.getPing);

app.use("/auth/*", passport.authenticate("jwt", { session: false }));

app.post("/register", ...userController.register);
app.post("/login", ...userController.login);

app.get("/auth/records", recordsController.getRecords);

app.get("/auth/sellers", sellersController.getSellers);
app.post("/auth/sellers", ...sellersController.postSellers);

type errorObject = {
  status: number,
  errors: object[],
};

app.use((err: errorObject, req: Request, res: Response, next: NextFunction) => {
  res
    .status(err.status || 500)
    .json({
      ok: false,
      errors: err.errors,
    });
});

export default app;
