import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.createUserIntoDB(req.body);
    sendResponse(
      res,
      true,
      201,
      "User registered successfully",
      result.rows[0],
    );
  } catch (error: any) {
    sendResponse(res, false, 500, error.message);
  }
};

export const atuhController = {
  createUser,
};
