import sinon from "sinon";

import SellerModel from "../seller.model";
import SellerService from "../seller.service";
const Seller = <any>SellerModel;

describe("SellerService.getSellers", () => {
  beforeEach(() => {
    sinon.stub(Seller, "find");
  });

  afterEach(() => {
    Seller.find.restore();
  });

  it("should return all sellers for current user", async () => {
    const SS = SellerService(Seller);
    Seller.find.resolves({});

    await expect(
      SS.getSellers("53cb6b9b4f4ddef1ad47f943"),
    ).resolves.not.toThrow();
  });

  it("should throw error if userId is invalid", async () => {
    const SS = SellerService(Seller);
    Seller.find.resolves({});

    await expect(
      SS.getSellers("asd"),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});

describe("SellerService.getSellerById", () => {
  beforeEach(() => {
    sinon.stub(Seller, "find");
  });

  afterEach(() => {
    Seller.find.restore();
  });

  it("should return all sellers for current user", async () => {
    const SS = SellerService(Seller);
    Seller.find.resolves({});

    await expect(
      SS.getSellerById("53cb6b9b4f4ddef1ad47f943", "53cb6b9b4f4ddef1ad47f943"),
    ).resolves.not.toThrow();
  });

  it("should throw error if sellerId is invalid", async () => {
    const SS = SellerService(Seller);
    Seller.find.resolves({});

    await expect(
      SS.getSellerById("53cb6b9b4f4ddef1ad47f943", "asd"),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should throw error if userId is invalid", async () => {
    const SS = SellerService(Seller);
    Seller.find.resolves({});

    await expect(
      SS.getSellerById("asd", "53cb6b9b4f4ddef1ad47f943"),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});
