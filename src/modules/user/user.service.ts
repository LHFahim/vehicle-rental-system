import { pool } from "../../config/db";
import { IUpdateUser } from "../../interfaces/user.interface";

const findAllUsers = async () => {
  const result = await pool.query(
    "SELECT id, name, email, phone, role FROM users"
  );

  return result.rows;
};

const updateUser = async (id: string, body: Partial<IUpdateUser>) => {
  const { name, email, phone, role } = body;

  const result = await pool.query(
    "UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING id, name, email, phone, role",
    [name, email, phone, role, id]
  );

  return result.rows[0];
};

const deleteUser = async (id: string) => {
  const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);

  return (result.rowCount ?? 0) > 0;
};

export const UserServices = {
  findAllUsers,
  updateUser,
  deleteUser,
};
