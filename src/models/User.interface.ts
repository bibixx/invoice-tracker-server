import mongoose from "mongoose";

export interface IUserWithoutPassword {
  email: String;
}

export interface IUser extends IUserWithoutPassword {
  password: String;
}