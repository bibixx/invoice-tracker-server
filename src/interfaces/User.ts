export interface IUser {
  _id: any;
  local: {
    password: string;
    email: string;
  };
}
