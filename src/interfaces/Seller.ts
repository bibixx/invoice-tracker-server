import { IUserModel } from "../models/User";

export interface ISeller {
  owner: IUserModel;
  name: String;
  nip: String;
  city: String;
  street: String;
  zip: String;
  seller: boolean;
  place: boolean;
}
