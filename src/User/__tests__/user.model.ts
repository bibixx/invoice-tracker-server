import User, { IUserModel } from "../user.model";
import jwt from "jsonwebtoken";

import { genSalt, genHash } from "../../util/bcrypt";

const password = "passw0rd"; // cSpell:disable-line

describe("User.comparePasswords", () => {
  it("should succeed if passwords match", async () => {
    const user: IUserModel = new User({
      local: {
        email: "a@a.pl",
        password,
      },
    });

    const salt = await genSalt();
    const hash = await genHash(user.local.password, salt);

    user.local.password = hash;
    expect(user.comparePasswords(password)).resolves.toEqual(true);
  });
});

describe("User.createToken", () => {
  it("should return jwt of user", async () => {
    const user: IUserModel = new User({
      local: {
        email: "a@a.pl",
        password,
      },
    });

    const tokenHash = user.createToken();
    const token = jwt.decode(tokenHash);

    expect(Object.keys(token).sort()).toEqual(["email", "_id", "iat"].sort());
  });
});
