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
  const { id } = req.params;
  const body = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required", data: null });
  }

  try {
    const result = await UserServices.updateUser(id, body);

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

export const userControllers = {
  findAllUsers,
  updateUser,
};
