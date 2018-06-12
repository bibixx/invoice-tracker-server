import * as yup from "yup";
import { Model } from "mongoose";
import { IUserModel } from "./user.model";
import { uppercaseUnicodeRegex } from "../util/uppercaseUnicodeRegex";

const createUser = User =>
  (email: string, password: string, passwordConfirm: string) =>
    new Promise(async (resolve, reject) => {
      const schema = yup.object().shape({
        email: yup.string().required().email(),
        password: yup.string().required()
          .min(8)
          .test(
            "password must contain uppercase letter",
            "password must contain uppercase letter",
            val => uppercaseUnicodeRegex.test(val),
          )
          .test(
            "password must contain a number",
            "password must contain a number",
            val => /[0-1]/.test(val),
          ),
        passwordConfirm: yup.string().required()
          .test("passwords match", "passwords must match", function (val) {
            return val === this.parent.password;
          }),
      });

      try {
        await schema.validate({
          email,
          password,
          passwordConfirm,
        });
      } catch (err) {
        return reject(err);
      }

      if (await User.findOne({ "local.email": email }) !== null) {
        return reject(new Error(`user with email ${email} was already created`));
      }

      await User.create({
        local: {
          email,
          password,
        },
      });

      return resolve();
    });

const login = User =>
  (email: string, password: string) =>
      new Promise(async (resolve, reject) => {
        const schema = yup.object().shape({
          email: yup.string().required().email(),
          password: yup.string().required()
            .min(8)
            .test(
              "password must contain uppercase letter",
              "password must contain uppercase letter",
              val => uppercaseUnicodeRegex.test(val),
            )
            .test(
              "password must contain a number",
              "password must contain a number",
              val => /[0-1]/.test(val),
            ),
        });

        try {
          await schema.validate({
            email,
            password,
          });
        } catch (err) {
          return reject(err);
        }

        const user: IUserModel = await User.findOne({ "local.email": email });

        if (!user) {
          return reject(new Error("incorrect email or password."));
        }

        const doPasswordsMatch = await user.comparePasswords(password);

        if (!doPasswordsMatch) {
          return reject(new Error("incorrect email or password."));
        }

        return resolve(user);
      });

export default (User: Model<IUserModel>) => ({
  createUser: createUser(User),
  login: login(User),
});
