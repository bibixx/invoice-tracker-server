import request from "supertest";
import mongoose from "mongoose";
import bluebird from "bluebird";
import jwt from "jsonwebtoken";

import app from "../src/app";
import User from "../src/models/User";

import { IUserModel } from "../src/models/User";

const chai = require("chai");
const expect = chai.expect;

const email = "a@a.pl";
const password = "passw0rd";

describe("POST /register", () => {
  beforeAll(async () => {
    const mongoUrl = "mongodb://localhost:27017/invoice-test";
    (<any>mongoose).Promise = bluebird;

    try {
      await mongoose.connect(mongoUrl, {useMongoClient: true});
    } catch (err) {
      console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    }
  });

  beforeEach(async () => {
    await User.remove({});
  });

  it("should return 200 OK if all parameters are ok", () => {
    return request(app)
      .post("/register")
      .send(`email=${email}&password=${password}&confirmPassword=${password}`)
      .expect(200)
      .then((res) => {
        expect(res.body.ok).to.equal(true);
      });
  });

  it("should return error if email is invalid", () => {
    return request(app)
      .post("/register")
      .send(`email=a@a&password=${password}&confirmPassword=${password}`)
      .expect(422)
      .then((res) => {
        expect(res.body.ok).to.equal(false);
        expect(res.body.errors[0].msg).to.equal("Invalid value");
      });
  });

  it("should return error if passwords don't match", () => {
    return request(app)
      .post("/register")
      .send(`email=${email}&password=${password}&confirmPassword=passw0r`)
      .expect(422)
      .then((res) => {
        expect(res.body.ok).to.equal(false);
        expect(res.body.errors[0].msg).to.equal("Passwords must match");
      });
  });

  it("should return 500 if user with specified email was already registered", async () => {
    await request(app)
      .post("/register")
      .send(`email=${email}&password=${password}&confirmPassword=${password}`);

    return request(app)
      .post("/register")
      .send(`email=${email}&password=${password}&confirmPassword=${password}`)
      .expect(500);
  });

  it("should create valid user", async () => {
    await request(app)
      .post("/register")
      .send(`email=${email}&password=${password}&confirmPassword=${password}`);

    const user: IUserModel = await User.findOne({});

    expect(user.email).to.equal(email);
    expect(await user.comparePasswords(password)).to.equal(true);
  });

});

describe("POST /login", () => {
  beforeAll(async () => {
    const mongoUrl = "mongodb://localhost:27017/invoice-test";
    (<any>mongoose).Promise = bluebird;

    try {
      await mongoose.connect(mongoUrl, {useMongoClient: true});
      const user = new User({
        email,
        password,
      });
    } catch (err) {
      console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    }
  });

  it("should return 200 after successful login", async () => {
    const res = await request(app)
      .post("/login")
      .send(`email=${email}&password=${password}`)
      .expect(200)
      .then((res) => {
        expect(res.body.ok).to.equal(true);
      });
  } );

  it("should return error if user doesn't exist", async () => {
    await request(app)
      .post("/login")
      .send(`email=other@mail.com&password=${password}`)
      .expect(422)
      .then((res) => {
        expect(res.body.ok).to.equal(false);
        expect(res.body.errors[0].msg).to.equal("User doesn't exist");
      });
  } );

  it("should return error if password is invalid", async () => {
    await request(app)
      .post("/login")
      .send(`email=${email}&password=${password}-invalid`)
      .expect(422)
      .then((res) => {
        expect(res.body.errors[0].msg).to.equal("Wrong password");
      });
  } );

  it("should return jwt of user", async () => {
    await request(app)
      .post("/login")
      .send(`email=${email}&password=${password}`)
      .expect(200)
      .then((res) => {
        let token;

        expect(() => { token = jwt.decode(res.body.token); }).not.to.throw();
        expect(token.email).to.equal(email);
      });
  });
});