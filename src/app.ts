import express from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import lusca from "lusca";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { MONGODB_URI } from "./util/secrets";
import handleError from "./routes/error";
import routes from "./routes";
import "./auth/passport";

dotenv.config({ path: ".env" });

const app = express();

(<any>mongoose).Promise = global.Promise;
mongoose.connect(MONGODB_URI)
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

app.use("/ping", routes.ping);
app.use("/auth", routes.auth);
app.use("/records", routes.records);
app.use("/sellers", routes.sellers);

app.use(handleError);

export default app;
