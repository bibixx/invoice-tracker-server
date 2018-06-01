import chai, { expect, assert } from "chai";
import request from "supertest";
import mongoose from "mongoose";
// import bluebird from "bluebird";
import jwt from "jsonwebtoken";

import User, { IUserModel } from "../src/models/User";
import app from "../src/app";

const email = "a@a.pl";
const password = "passw0rd";

const MONGODB_URI_TEST = "mongodb://localhost:27017/invoice-test";

describe("POST /register", () => {
  beforeAll(async () => {
    (<any>mongoose).Promise = global.Promise;

    try {
      await mongoose.connect(MONGODB_URI_TEST, { useMongoClient: true });
    } catch (err) {
      console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    }
  });

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should return 200 OK if all parameters are ok", async () => {
    const res = await request(app)
      .post("/register")
      .send(`email=${email}&password=${password}&confirmPassword=${password}`)
      .expect(200);

    expect(res.body.ok).to.equal(true);
  });

  it("should return error if email is invalid", async () => {
    const res = await request(app)
      .post("/register")
      .send(`email=a@a&password=${password}&confirmPassword=${password}`)
      .expect(422);

    expect(res.body.errors[0].msg).to.equal("Email invalid");
  });

  it("should return error if passwords don't match", async () => {
    const res = await request(app)
      .post("/register")
      .send(`email=${email}&password=${password}&confirmPassword=${password}-invalid`)
      .expect(422);

    expect(res.body.errors[0].msg).to.equal("Passwords must match");
  });

  it("should return 422 if user with specified email was already registered", async () => {
    const user = new User({ email, password });
    user.save().then(async () => {
      const res = await request(app)
        .post("/register")
        .send(`email=${email}&password=${password}&confirmPassword=${password}`)
        .expect(422);

      expect(res.body.errors[0].msg).to.equal("This email is already in use");
    });
  });

  it.skip("should return 422 if password doesn't match password requirements", async () => {
    const res = await request(app)
      .post("/register")
      .send(`email=${email}&password=${password}&confirmPassword=${password}-invalid`)
      .expect(422);

    expect(res.body.errors[0].msg).to.equal("Passwords must match");
  });

  it("should create valid user", async () => {
    await request(app)
      .post("/register")
      .send(`email=${email}&password=${password}&confirmPassword=${password}`)
      .expect(200);

    const user: IUserModel = await User.findOne({});

    expect(user.email).to.equal(email);
    expect(await user.comparePasswords(password)).to.equal(true);
  });
});

describe("POST /login", () => {
  beforeAll(async () => {
    (<any>mongoose).Promise = global.Promise;

    try {
      await mongoose.connect(MONGODB_URI_TEST, { useMongoClient: true });
    } catch (err) {
      console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    }
  });

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();

    const user = new User({ email, password });
    await user.save();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should return 200 after successful login", async () => {
    const res = await request(app)
      .post("/login")
      .send(`email=${email}&password=${password}`)
      .expect(200);
  });

  // it("should return error if user doesn't exist", async () => {
  //   const res = await request(app)
  //     .post("/login")
  //     .send(`email=a@b.pl&password=${password}`)
  //     .expect(422);

  //   expect(res.body.errors[0].msg).to.equal("User doesn't exist");
  // });

  // it("should return error if password is invalid", async () => {
  //   const res = await request(app)
  //     .post("/login")
  //     .send(`email=${email}&password=${password}-invalid`)
  //     .expect(422);

  //   expect(res.body.errors[0].msg).to.equal("Wrong password");
  // });

  // it("should return jwt of user", async () => {
  //   const res = await request(app)
  //     .post("/login")
  //     .send(`email=${email}&password=${password}`)
  //     .expect(200);

  //   let token;
  //   expect(() => { token = jwt.decode(res.body.token); }).not.to.throw();
  //   expect(token.email).to.equal(email);
  //   expect(token._id).to.not.be.undefined;
  // });
});
