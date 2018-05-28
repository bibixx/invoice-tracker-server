import request from "supertest";
import app from "../src/app";

import User, { IUserModel } from "../src/models/User";
import Seller, { ISellerModel } from "../src/models/Seller";
import { IUserWithoutPassword } from "../src/interfaces/User";

import { createToken } from "../src/util/createToken";

import mongoose, { mongo } from "mongoose";
import bluebird from "bluebird";

const chai = require("chai");
const expect = chai.expect;

const MONGODB_URI_TEST = "mongodb://localhost:27017/invoice-test";

let token: string;

let sellerMock: ISellerModel[];

describe("GET /auth/sellers", () => {
  beforeAll(async () => {
    (<any>mongoose).Promise = bluebird;

    try {
      await mongoose.connect(MONGODB_URI_TEST, { useMongoClient: true }).then(() => {});
      const user: IUserModel = new User({ email: "a@a.pl", password: "passw0rd" });
      const user2: IUserModel = new User({ email: "b@a.pl", password: "passw0rd" });

      await Promise.all([user.save(), user2.save()]);

      const userData: IUserWithoutPassword = {
        _id: user._id,
        email: user.email,
      };

      token = createToken(userData);
    } catch (err) {
      console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    }
  });

  beforeEach(async () => {
    await Seller.remove({});

    const users = await User.find({});

    sellerMock = [
      new Seller({
        owner: users[0],
        name: "A",
        nip: "000000",
        city: "Warszawa",
        street: "Pisarka",
        zip: "03-984",
        seller: true,
        place: true,
      }),
      new Seller({
        owner: users[1],
        name: "A",
        nip: "000001",
        city: "Warszawa",
        street: "Pisarka",
        zip: "03-984",
        seller: true,
        place: true,
      }),
    ];

    await Promise.all(sellerMock.map(s => s.save()));
  });

  afterAll(async () => {
    await Seller.remove({});
    await User.remove({});
    await mongoose.disconnect();
  });

  it("should return 200", async () => {
    return request(app)
      .get("/auth/sellers")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        expect(res.body.ok).to.equal(true);
      });
  });

  it("should return all sellers for current user", async () => {
    return request(app)
      .get("/auth/sellers")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        expect(res.body.sellers).to.have.lengthOf(1);
      });
  });
});

describe("POST /auth/sellers", () => {
  beforeAll(async () => {
    (<any>mongoose).Promise = bluebird;

    try {
      await mongoose.connect(MONGODB_URI_TEST, { useMongoClient: true }).then(() => {});
      const user: IUserModel = new User({ email: "a@a.pl", password: "passw0rd" });

      await user.save();

      const userData: IUserWithoutPassword = {
        _id: user._id,
        email: user.email,
      };

      token = createToken(userData);
    } catch (err) {
      console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    }
  });

  beforeEach(async () => {
    Seller.remove({});
  });

  afterAll(async () => {
    await Seller.remove({});
    await User.remove({});
    await mongoose.disconnect();
  });

  it("should return 200", async () => {
    return request(app)
      .get("/auth/sellers")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        expect(res.body.ok).to.equal(true);
      });
  });
});
