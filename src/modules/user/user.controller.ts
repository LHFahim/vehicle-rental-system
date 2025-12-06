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

export const userControllers = {
  findAllUsers,
};
