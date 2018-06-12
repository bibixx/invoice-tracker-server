import { IUserModel } from "../User/user.model";

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
