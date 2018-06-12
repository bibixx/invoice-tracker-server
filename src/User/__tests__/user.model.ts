import User, { IUserModel } from "../user.model";

import { genSalt, genHash } from "../../util/bcrypt";

describe("User.comparePasswords", () => {
  it("should succeed if passwords match", async () => {
    const password = "passw0rd";
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
  })
})