import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import config from "../config";
import sendResponse from "../utils/sendResponse";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return sendResponse(res, false, 401, "Unauthorized Access");
    }
    const decoded = jwt.verify(token, config.secretKey as string);
    (req as any).user = decoded;
    next();
  } catch {
    return sendResponse(res, false, 401, "Invalid token");
  }
};

export const roleCheck = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!roles.includes(user.role)) {
      return sendResponse(res, false, 403, "Forbidden");
    }
    next();
  };
};
