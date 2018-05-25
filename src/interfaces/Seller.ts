import { IUser } from "./User";

export interface ISeller {
  owner: IUser;
  name: String;
  nip: String;
  city: String;
  street: String;
  zip: String;
  seller: boolean;
  place: boolean;
}