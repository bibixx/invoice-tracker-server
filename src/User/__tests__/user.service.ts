import sinon from "sinon";

import UserModel from "../user.model";
import UserService from "../user.service";

const User = <any>UserModel;

const password = "Abcdefghijk123"; // cSpell:disable-line

describe("UserService.createUser", () => {
  beforeEach(() => {
    sinon.stub(User, "findOne");
    sinon.stub(User, "create");
  });

  afterEach(() => {
    User.findOne.restore();
    User.create.restore();
  });

  it("should create a new user", async () => {
    User.findOne.resolves(null);
    User.create.resolves({});

    const US = UserService(User);

    const res = await US.createUser("a@a.pl", password, password);
    expect(res).not.toThrow;
    expect(sinon.assert.calledOnce(User.create));
  });

  it("should throw error if passwords don't match", async () => {
    User.findOne.resolves(null);
    User.create.resolves({});

    const US = UserService(User);
    await expect(US.createUser("a@a.pl", password, "b")).rejects.toThrowErrorMatchingSnapshot();
    expect(sinon.assert.notCalled(User.create));
  });

  it("should throw error if email is invalid", async () => {
    User.findOne.resolves(null);
    User.create.resolves({});

    const US = UserService(User);
    await expect(US.createUser("a@a", password, password)).rejects.toThrowErrorMatchingSnapshot();
    expect(sinon.assert.notCalled(User.create));
  });

  it("should throw error if user was previously signed up", async () => {
    User.findOne.resolves(true);
    User.create.resolves({});

    const US = UserService(User);

    await expect(US.createUser("a@a.pl", password, password))
      .rejects.toThrowErrorMatchingSnapshot();
    expect(sinon.assert.notCalled(User.create));
  });

  it("should throw error if password doesn't match requirements", async () => {
    User.findOne.resolves(null);
    User.create.resolves({});

    const US = UserService(User);

    /* cSpell:disable */
    await expect(
      US.createUser("a@a.pl", "ą", "ą"),
    ).rejects.toThrowErrorMatchingSnapshot();

    await expect(
      US.createUser("a@a.pl", "ąbcdefgh", "ąbcdefgh"),
    ).rejects.toThrowErrorMatchingSnapshot();

    await expect(
      US.createUser("a@a.pl", "Ąbcdefgh", "Ąbcdefgh"),
    ).rejects.toThrowErrorMatchingSnapshot();

    await expect(
      US.createUser("a@a.pl", "Ąbcdefgh1", "Ąbcdefgh1"),
    ).resolves.not.toThrow();

    /* cSpell:enable */

    expect(sinon.assert.calledOnce(User.create));
  });
});

describe("UserService.login", () => {
  beforeEach(() => {
    sinon.stub(User, "findOne");
  });

  afterEach(() => {
    User.findOne.restore();
  });

  it("should throw error if user doesn't exist", async () => {
    User.findOne.resolves(null);

    const US = UserService(User);

    await expect(US.login("a@a.pl", password)).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should return error if password is invalid", async () => {
    User.findOne.resolves({
      comparePasswords: () => Promise.resolve(false),
    });

    const US = UserService(User);

    await expect(US.login("a@a.pl", password)).rejects.toThrowErrorMatchingSnapshot();
  });

  it("should successfully login", async () => {
    User.findOne.resolves({
      email: true,
      comparePasswords: () => Promise.resolve(true),
    });

    const US = UserService(User);

    await expect(US.login("a@a.pl", password)).resolves.not.toThrow();
  });

  it("should throw error if password doesn't match requirements", async () => {
    User.findOne.resolves({
      comparePasswords: () => Promise.resolve(true),
    });

    const US = UserService(User);

    /* cSpell:disable */
    await expect(US.login("a@a.pl", "ą")).rejects.toThrowErrorMatchingSnapshot();
    await expect(US.login("a@a.pl", "ąbcdefgh")).rejects.toThrowErrorMatchingSnapshot();
    await expect(US.login("a@a.pl", "Ąbcdefgh")).rejects.toThrowErrorMatchingSnapshot();
    await expect(US.login("a@a.pl", "Ąbcdefgh1")).resolves.not.toThrow();
    /* cSpell:enable */
  });
});
