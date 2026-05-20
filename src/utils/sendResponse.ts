import type { Response } from "express";

const sendResponse = (
  res: Response,
  success: boolean,
  statusCode: number,
  message: string,
  data?: any,
  error?: any,
) => {
  res.status(statusCode).json({
    success,
    message,
    data,
    error,
  });
};

export default sendResponse;
