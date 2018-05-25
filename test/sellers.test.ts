import request from "supertest";
import app from "../src/app";

import { IUser } from "../src/interfaces/User";
import { ISeller } from "../src/interfaces/Seller";

import Seller from "../src/models/Seller";
import User from "../src/models/User";

import { createToken } from "../src/util/createToken";


import mongoose, { mongo } from "mongoose";
import bluebird from "bluebird";

const chai = require("chai");
const expect = chai.expect;

// const token: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFAYS5wbCJ9.ZMq6oOXCFuPcA6Duf7ILa4Aj8qSNIkDH92ixGMi72Ac";
let token: string;

let sellerMock: ISeller[];

describe("GET /auth/sellers", () => {
  beforeAll( async () => {
    const mongoUrl = "mongodb://localhost:27017/invoice-test";
    (<any>mongoose).Promise = bluebird;

    try {
      await mongoose.connect(mongoUrl, {useMongoClient: true});
    } catch (err) {
      console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    }
  });

  beforeEach( async () => {
    const user1: IUser = new User({ email: "a@a.pl", password: "passw0rd" });
    const user2: IUser = new User({ email: "b@a.pl", password: "passw0rd" });
    user1.save();
    user2.save();

    console.log({
      _id: user1._id,
      email: user1.email
    });


    token = createToken({
      _id: user1._id,
      email: user1.email
    });


    sellerMock = [
      {
        owner: user1,
        name: "A",
        nip: "000000",
        city: "Warszawa",
        street: "Pisarka 2",
        zip: "03-984",
        seller: true,
        place: true,
      },
      {
        owner: user2,
        name: "A",
        nip: "000000",
        city: "Warszawa",
        street: "Pisarka 2",
        zip: "03-984",
        seller: true,
        place: true,
      },
    ];

    const sellers = sellerMock.map( m => new Seller(m) );
    const sellerPromises = sellers.map(s => s.save());

    await Promise.all(sellerPromises);
  } );

  afterEach(async () => {
    await User.remove({});
    await Seller.remove({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should return 200", async () => {
    await request(app)
      .get("/auth/sellers")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("should return all sellers for current user", async () => {
    await request(app)
      .get("/auth/sellers")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        expect(res.body.sellers).to.have.lengthOf(sellerMock.filter( s => s.owner.email === "a@a.pl").length);
      });
  });
});