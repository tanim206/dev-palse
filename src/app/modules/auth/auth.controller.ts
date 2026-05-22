import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import sendResponse from "../../utils/sendResponse.js";

const signupUser = async (req: Request, res: Response) => {
  try {
    const user = await authService.createUser(req.body);
    sendResponse(res, true, 201, "User registered successfully", user);
  } catch (error: any) {
    sendResponse(res, false, 500, error.message);
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    sendResponse(res, true, 200, "Login successful", result);
  } catch (error: any) {
    sendResponse(res, false, 500, error.message);
  }
};

export const authController = {
  signupUser,
  loginUser,
};
