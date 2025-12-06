export interface ICreateUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "admin" | "customer";
}

export interface IUpdateUser extends Omit<ICreateUser, "password"> {}
