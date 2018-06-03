import chai, { expect, assert } from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);
const { request } = chai;

import app from "../src/app";

import User, { IUserModel } from "../src/models/User";
import Seller, { ISellerModel } from "../src/models/Seller";
import { IUserWithoutPassword } from "../src/interfaces/User";

import { createToken } from "../src/util/createToken";
import { MONGODB_URI } from "../src/util/secrets";

import mongoose, { mongo } from "mongoose";
import bluebird from "bluebird";
import { createEmail } from "./utils/createEmail";

let token: string;

let sellerMock: ISellerModel[];

const sellerEmail1 = createEmail();
const sellerEmail2 = createEmail();
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

describe("GET /auth/sellers", () => {
  beforeAll(async () => {
    const user: IUserModel = new User({ password, email: sellerEmail1 });
    const user2: IUserModel = new User({ password, email: sellerEmail2 });

    const userData: IUserWithoutPassword = {
      _id: user._id,
      email: user.email,
    };

    token = createToken(userData);

    sellerMock = [
      new Seller({
        owner: user,
        name: "A",
        nip: "000000",
        city: "Warszawa",
        street: "Pisarka",
        zip: "03-984",
        seller: true,
        place: true,
      }),
      new Seller({
        owner: user2,
        name: "A",
        nip: "000001",
        city: "Warszawa",
        street: "Pisarka",
        zip: "03-984",
        seller: true,
        place: true,
      }),
    ];

    await Promise.all([user.save(), user2.save()]);
    await Promise.all(sellerMock.map(s => s.save()));
  });

  it("should return 200", async () => {
    const res = await request(app)
      .get("/auth/sellers")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body.ok).to.equal(true);
  });

  it("should return all sellers for current user", async () => {
    const res = await request(app)
      .get("/auth/sellers")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body.sellers).to.have.lengthOf(1);
  });
});

describe("POST /auth/sellers", () => {
  beforeAll(async () => {
    const user: IUserModel = new User({ email: createEmail(), password: "passw0rd" });

    await user.save();

    const userData: IUserWithoutPassword = {
      _id: user._id,
      email: user.email,
    };

    token = createToken(userData);
  });

  it("should return 200", async () => {
    const res = await request(app)
      .get("/auth/sellers")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body.ok).to.equal(true);
  });
});
