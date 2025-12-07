import { Request, Response } from "express";
import { UserServices } from "./user.service";

const findAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.findAllUsers();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res
      .status(401)
      .json({ success: false, message: error.message, data: null });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const body = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required", data: null });
  }

  const isAdmin = req.user?.role === "admin";
  const isOwner = req.user?.id === userId;

  try {
    const result = await UserServices.updateUser(
      userId,
      body,
      isAdmin,
      isOwner
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error: any) {
    res
      .status(401)
      .json({ success: false, message: error.message, data: null });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }

  try {
    const result = await UserServices.deleteUser(userId);
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "User not found", data: null });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res
      .status(401)
      .json({ success: false, message: error.message, data: null });
  }
};

export const userControllers = {
  findAllUsers,
  updateUser,
  deleteUser,
};
