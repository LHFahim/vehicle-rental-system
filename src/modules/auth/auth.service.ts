import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db";
import { ICreateUser } from "../../interfaces/user.interface";

const createUser = async (body: ICreateUser) => {
  const { name, email, phone, password, role } = body;
  const hashedPassword = await bcrypt.hash(password as string, 10);

  const lowercaseEmail = email.toLowerCase();
  const passwordSixDigitCheck = password.length >= 6 ? true : false;

  if (!passwordSixDigitCheck) {
    throw new Error("Password must contain at least six digits.");
  }

  const newUser = await pool.query(
    "INSERT INTO users (name, email, phone, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role",
    [name, lowercaseEmail, phone, hashedPassword, role || "customer"]
  );

  return newUser;
};

const loginUser = async (email: string, password: string) => {
  const lowercaseEmail = email.toLowerCase();
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    lowercaseEmail,
  ]);

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return null;
  }

  const secret = config.SECRET as string;

  const token = jwt.sign(
    { name: user.name, email: user.email, role: user.role },
    secret,
    {
      expiresIn: "7d",
    }
  );

  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;

  return { token, user: userWithoutPassword };
};

export const authServices = {
  createUser,
  loginUser,
};
