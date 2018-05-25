import mongoose from "mongoose";

export interface IUserWithoutPassword {
  _id: String;
  email: String;
}

export interface IUser extends IUserWithoutPassword {
  password: String;
}