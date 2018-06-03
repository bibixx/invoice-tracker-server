import chai, { expect } from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);
const { request } = chai;

import app from "../src/app";

import User, { IUserModel } from "../src/models/User";
import Seller, { ISellerModel } from "../src/models/Seller";

import { MONGODB_URI } from "../src/util/secrets";

import mongoose from "mongoose";
import { createEmail } from "./utils/createEmail";

let token: string;

let sellerMock: ISellerModel[];

const sellerMockData = {
  name: "Mock from test API",
  nip: "3561376052",
  city: "Poznań",
  street: "Długa",
  zip: "05-894",
  seller: true,
  place: true,
};

const sellerMockDataEdited = {
  name: "Edited Mock from test API",
  nip: "1879046962",
  city: "Rzeszów",
  street: "Szeroka",
  zip: "01-897",
  seller: false,
  place: false,
};

const sellerEmail1 = createEmail();
const sellerEmail2 = createEmail();
const sellerEmail3 = createEmail();
const password = "passw0rd";

beforeAll(async () => {
  (<any>mongoose).Promise = global.Promise;

  try {
    await mongoose.connect(MONGODB_URI);
    await mongoose.connection.db.dropDatabase();
  } catch (err) {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
  }
});

afterAll(async () => {
  return mongoose.disconnect();
});

describe("GET /sellers", () => {
  beforeAll(async () => {
    const user: IUserModel = new User({
      local: {
        password, email: sellerEmail1,
      },
    });
    const user2: IUserModel = new User({
      local: {
        password, email: sellerEmail2,
      },
    });

    token = user.createToken();

    sellerMock = [
      new Seller({
        owner: user,
        name: "A",
        nip: "6396910871",
        city: "Warszawa",
        street: "Pisarka",
        zip: "03-984",
        seller: true,
        place: true,
      }),
      new Seller({
        owner: user2,
        name: "A",
        nip: "7345066710",
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

  it("should return 401 if token is not present", async () => {
    const res = await request(app)
      .get("/sellers");

    expect(res).to.have.status(401);
    expect(res.body.errors[0].msg).to.equal("No auth token");
  });

  it("should return 200", async () => {
    const res = await request(app)
      .get("/sellers")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body.ok).to.be.true;
  });

  it("should return all sellers for current user", async () => {
    const res = await request(app)
      .get("/sellers")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body.sellers).to.have.lengthOf(1);
  });
});

describe("POST /sellers", () => {
  beforeAll(async () => {
    const user: IUserModel = new User(<IUserModel>{
      local: {
        email: sellerEmail3, password: "passw0rd",
      },
    });

    await user.save();

    token = user.createToken();
  });

  it("should return 401 if token is not present", async () => {
    const res = await request(app)
      .post("/sellers");

    expect(res).to.have.status(401);
    expect(res.body.errors[0].msg).to.equal("No auth token");
  });

  it("should return 200", async () => {
    const res = await request(app)
      .post("/sellers")
      .set("Authorization", `Bearer ${token}`)
      .send(
        Object.entries(sellerMockData)
          .map(([key, value]) => `${key}=${value}`)
          .join("&"),
      );

    expect(res).to.have.status(200);
    expect(res.body.ok).to.be.true;
  });

  it("should add new seller for current user", async () => {
    const res = await request(app)
      .post("/sellers")
      .set("Authorization", `Bearer ${token}`)
      .send(
          Object.entries(sellerMockData)
            .map(([key, value]) => `${key}=${value}`)
            .join("&"),
        );

    const user = await User.findOne({ "local.email": sellerEmail3 });
    const userId = mongoose.Types.ObjectId(user._id);
    const seller: ISellerModel[] =
      await Seller.find({ owner: userId });

    const { 1: sellerToCheck } = seller;
    expect(seller).to.have.lengthOf(2);

    expect(sellerToCheck.name).to.equal(sellerMockData.name);
    expect(sellerToCheck.nip).to.equal(sellerMockData.nip);
    expect(sellerToCheck.city).to.equal(sellerMockData.city);
    expect(sellerToCheck.street).to.equal(sellerMockData.street);
    expect(sellerToCheck.zip).to.equal(sellerMockData.zip);
    expect(sellerToCheck.seller).to.equal(sellerMockData.seller);
    expect(sellerToCheck.place).to.equal(sellerMockData.place);
  });

  it("should return 422 if parameters are missing", async () => {
    const res = await request(app)
      .post("/sellers")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(422);
    expect(res.body.errors).to.have.lengthOf(8);
  });

  it("should return 422 if nip is invalid", async () => {
    const mockData = { ...sellerMockData, nip: "0000000001" };
    const res = await request(app)
      .post("/sellers")
      .set("Authorization", `Bearer ${token}`)
      .send(
          Object.entries(mockData)
            .map(([key, value]) => `${key}=${value}`)
            .join("&"),
        );

    expect(res).to.have.status(422);
    expect(res.body.errors[0].msg).to.equal("NIP is invalid");
  });
});

describe("PUT /sellers", () => {
  beforeAll(async () => {
    const user: IUserModel = new User(<IUserModel>{
      local: {
        email: sellerEmail3, password: "passw0rd",
      },
    });

    await user.save();

    token = user.createToken();
  });

  it("should return 401 if token is not present", async () => {
    const res = await request(app)
      .put("/sellers");

    expect(res).to.have.status(401);
    expect(res.body.errors[0].msg).to.equal("No auth token");
  });

  it("should return 200 if only valid id is passed", async () => {
    const seller = await Seller.findOne();

    const res = await request(app)
      .put(`/sellers/${seller._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body.ok).to.be.true;
  });

  it("should return 422 if passed id is invalid", async () => {
    const res = await request(app)
      .put("/sellers/1")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(422);
    expect(res.body.errors[0].msg).to.equal("Specified id is not a valid id");
  });

  it("should return 422 if seller with specified id doesn't exist", async () => {
    const res = await request(app)
      .put("/sellers/5b14507ec147b15843f810c7")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(422);
    expect(res.body.errors[0].msg).to.equal("Seller with specifed id does not exist");
  });

  it("should edit seller", async () => {
    const seller = await Seller.findOne();

    const res = await request(app)
      .put(`/sellers/${seller._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(
        Object.entries(sellerMockDataEdited)
          .map(([key, value]) => `${key}=${value}`)
          .join("&"),
      );

    expect(res).to.have.status(200);

    const newSeller = await Seller.findById(seller._id);

    expect(newSeller.name).to.equal(sellerMockDataEdited.name);
    expect(newSeller.nip).to.equal(sellerMockDataEdited.nip);
    expect(newSeller.city).to.equal(sellerMockDataEdited.city);
    expect(newSeller.street).to.equal(sellerMockDataEdited.street);
    expect(newSeller.zip).to.equal(sellerMockDataEdited.zip);
    expect(newSeller.seller).to.equal(sellerMockDataEdited.seller);
    expect(newSeller.place).to.equal(sellerMockDataEdited.place);
  });
});

describe("DELETE /sellers", () => {
  beforeAll(async () => {
    const user: IUserModel = new User(<IUserModel>{
      local: {
        email: sellerEmail3, password: "passw0rd",
      },
    });

    await user.save();

    token = user.createToken();
  });

  it("should return 401 if token is not present", async () => {
    const res = await request(app)
      .del("/sellers");

    expect(res).to.have.status(401);
    expect(res.body.errors[0].msg).to.equal("No auth token");
  });

  it("should return 200 if only valid id is passed", async () => {
    const seller = await Seller.findOne();

    const res = await request(app)
      .del(`/sellers/${seller._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body.ok).to.be.true;
  });

  it("should return 422 if passed id is invalid", async () => {
    const res = await request(app)
      .del("/sellers/1")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(422);
    expect(res.body.errors[0].msg).to.equal("Specified id is not a valid id");
  });

  it("should return 422 if seller with specified id doesn't exist", async () => {
    const res = await request(app)
      .del("/sellers/5b14507ec147b15843f810c7")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(422);
    expect(res.body.errors[0].msg).to.equal("Seller with specifed id does not exist");
  });

  it.skip("should return 422 if seller is a dependant of a record", () => {});

  it("should remove seller", async () => {
    const seller = await Seller.findOne();

    const res = await request(app)
      .del(`/sellers/${seller._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);

    const newSeller = await Seller.findById(seller._id);

    expect(newSeller).to.be.null;
  });
});
