import bcrypt from "bcryptjs";
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

export const authServices = {
  createUser,
};
