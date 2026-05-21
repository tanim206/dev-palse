import type { Request, Response } from "express";
import { authService } from "./auth.service";

const signupUser = async (req: Request, res: Response) => {
  const user = await authService.createUser(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(
      req.body.email,
      req.body.password
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

export const authController = {
  signupUser,
  loginUser,
};