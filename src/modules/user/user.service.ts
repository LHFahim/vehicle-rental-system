import { pool } from "../../config/db";
import { IUpdateUser } from "../../interfaces/user.interface";

const findAllUsers = async () => {
  const result = await pool.query(
    "SELECT id, name, email, phone, role FROM users"
  );

  return result.rows;
};

const updateUser = async (
  userId: string,
  body: Partial<IUpdateUser>,
  isAdmin: boolean,
  isOwner: boolean
) => {
  if (!isAdmin && !isOwner) {
    throw new Error("Unauthorized");
  }

  const existingUser = await pool.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);

  if (isAdmin) {
    if (existingUser.rows.length === 0) {
      throw new Error("User not found");
    }

    const updatedUser = { ...existingUser.rows[0], ...body };

    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING id, name, email, phone, role",
      [
        updatedUser.name,
        updatedUser.email,
        updatedUser.phone,
        updatedUser.role,
        userId,
      ]
    );

    return result.rows[0];
  }

  if (isOwner) {
    const updatedUser = { ...existingUser.rows[0], ...body };

    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING id, name, email, phone, role",
      [
        updatedUser.name,
        updatedUser.email,
        updatedUser.phone,
        updatedUser.role,
        userId,
      ]
    );

    return result.rows[0];
  }
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
