import chai, { expect, assert } from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);
const { request } = chai;

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { MONGODB_URI } from "../src/util/secrets";

import { createEmail } from "./utils/createEmail";

import User, { IUserModel } from "../src/models/User";
import app from "../src/app";

const loginEmail = createEmail();
const password = "passw0rd";

beforeAll(async () => {
  (<any>mongoose).Promise = global.Promise;

  try {
    await mongoose.connect(MONGODB_URI);
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.db.createIndex("users", { email: 1 }, { unique: true });
  } catch (err) {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
  }
});

afterAll(async () => {
  return mongoose.disconnect();
});

describe("POST /register", () => {
  it("should return error if email is invalid", async () => {
    const email = createEmail("@a");

    const res = await request(app)
    .post("/register")
      .send(`email=${email}&password=${password}&confirmPassword=${password}`);

    expect(res).to.have.status(422);
    expect(res.body.errors[0].msg).to.equal("Email invalid");
  });

  it("should return error if passwords don't match", async () => {
    const email = createEmail();

    const res = await request(app)
    .post("/register")
      .send(`email=${email}&password=${password}&confirmPassword=${password}-invalid`);

    expect(res).to.have.status(422);
    expect(res.body.errors[0].msg).to.equal("Passwords must match");
  });

  it("should return 422 if user with specified email was already registered", async () => {
    const email = createEmail();

    const u = new User({ email, password });
    await u.save();

    const res = await request(app)
      .post("/register")
      .send(`email=${email}&password=${password}&confirmPassword=${password}`);

    expect(res).to.have.status(422);
    expect(res.body.errors[0].msg).to.equal("This email is already in use");
  });

  it.skip("should return 422 if password doesn't match password requirements", async () => {
    const email = createEmail();

    const res = await request(app)
      .post("/register")
      .send(`email=${email}&password=${password}&confirmPassword=${password}`);

    expect(res).to.have.status(422);
    expect(res.body.errors[0].msg).to.equal("Passwords must match");
  });

  it("should return 200", async () => {
    const email = createEmail();

    const res = await request(app)
      .post("/register")
      .send(`email=${email}&password=${password}&confirmPassword=${password}`);

    expect(res).to.have.status(200);
  });

  it("should create valid user", async () => {
    const email = createEmail();

    const res = await request(app)
      .post("/register")
      .send(`email=${email}&password=${password}&confirmPassword=${password}`);

    const user: IUserModel = await User.findOne({ email });

    expect(res).to.have.status(200);
    expect(user.email).to.equal(email);
    expect(await user.comparePasswords(password)).to.equal(true);
  });
});

describe("POST /login", () => {
  beforeAll(async () => {
    const password = "passw0rd";

    const user = new User({ password, email: loginEmail });
    await user.save();
  });

  it("should return 200 after successful login", async () => {
    const email = loginEmail;

    const res = await request(app)
    .post("/login")
      .send(`email=${email}&password=${password}`);

    expect(res).to.have.status(200);
  });

  it("should return error if user doesn't exist", async () => {
    const email = createEmail();

    const res = await request(app)
      .post("/login")
      .send(`email=${email}&password=${password}`);

    expect(res).to.have.status(422);
    expect(res.body.errors[0].msg).to.equal("User doesn't exist");
  });

  it("should return error if password is invalid", async () => {
    const email = loginEmail;

    const res = await request(app)
      .post("/login")
      .send(`email=${email}&password=${password}-invalid`);

    expect(res).to.have.status(422);
    expect(res.body.errors[0].msg).to.equal("Wrong password");
  });

  it("should return jwt of user", async () => {
    const email = loginEmail;

    const res = await request(app)
      .post("/login")
      .send(`email=${email}&password=${password}`);

    let token;
    expect(res).to.have.status(200);
    expect(() => { token = jwt.decode(res.body.token); }).not.to.throw();
    expect(token.email).to.equal(email);
    expect(token._id).to.not.be.undefined;
  });
});
