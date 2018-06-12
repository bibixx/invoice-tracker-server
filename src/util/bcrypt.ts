import bcrypt from "bcrypt-nodejs";
import { BCRYPT_ROUNDS } from "./secrets";

export const genSalt = (): Promise<string> => new Promise((resolve, reject) => {
  bcrypt.genSalt(BCRYPT_ROUNDS, (err, salt) => {
    if (err) {
      return reject(err);
    }
    
    return resolve(salt);
  })
});

export const genHash = (password: string, salt: string): Promise<string> => new Promise((resolve, reject) => {
  bcrypt.hash(password, salt, undefined, (err: Error, hash) => {
    if (err) {
      return reject(err);
    }
    
    return resolve(hash);
  })
});

export const compare = (password1: string, password2: string): Promise<boolean> => new Promise((resolve, reject) => {
  bcrypt.compare(password1, password2, (err, res) => {
    if (err) {
      return reject(err);
    }

    return resolve(res);
  });
});