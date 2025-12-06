import { Request, Response } from "express";
import { authServices } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
  // const { name, email, phone, password, role } = req.body;

  try {
    const result = await authServices.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authServices.loginUser(email, password);

    res
      .status(200)
      .json({ success: true, message: "Login successful", data: result });
  } catch (error: any) {
    res
      .status(401)
      .json({ success: false, message: error.message, data: null });
  }
};

export const authControllers = {
  createUser,
  loginUser,
};
