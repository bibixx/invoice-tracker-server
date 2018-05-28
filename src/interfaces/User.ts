export interface IUserWithoutPassword {
  _id: any;
  email: String;
}

export interface IUser extends IUserWithoutPassword {
  password: String;
}
