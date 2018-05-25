import express from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import logger from "./util/logger";
import lusca from "lusca";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import bluebird from "bluebird";
import { MONGODB_URI } from "./util/secrets";
import { Request, Response, NextFunction } from "express";


import * as apiController from "./controllers/api";
import * as userController from "./controllers/user";

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env.example" });

// Create Express server
const app = express();

// Connect to MongoDB

(<any>mongoose).Promise = bluebird;

mongoose.connect(MONGODB_URI, {useMongoClient: true}).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
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

app.post("/register", ...userController.register);
app.post("/login", ...userController.login);

type errorObject = {
  status: number,
  errors: Array<object>
};

app.use((err: errorObject, req: Request, res: Response, next: NextFunction) => {
  res
    .status(err.status || 500)
    .json({
      ok: false,
      errors: err.errors
    });
});

export default app;