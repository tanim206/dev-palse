import type { Request, Response } from "express";
import { issueService } from "./issues.service";
import sendResponse from "../../utils/sendResponse";

const createIssue = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const issue = await issueService.createIssueIntoDB({
    ...req.body,
    reporter_id: user.id,
  });

  res.status(201).json({
    success: true,
    message: "Issue created successfully",
    data: issue,
  });
};

// const getAllIssues = async (req: Request, res: Response) => {
//   const data = await issueService.getAllIssuesFromDB(req.query);

//   res.json({
//     success: true,
//     data,
//   });

// };

const getAllIssues = async (req: Request, res: Response) => {
  const result = await issueService.getAllIssuesFromDB(req.query);
  return res.status(200).json({
    success: true,
    data: result,
  });
};

const getSingleIssue = async (req: Request, res: Response) => {
  const data = await issueService.getSingleIssueFromDB(req.params.id as string);

  if (!data) {
    return res.status(404).json({
      success: false,
      message: "Issue not found",
    });
  }

  res.json({
    success: true,
    data,
  });
};

const updateIssue = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const issue = await issueService.getSingleIssueFromDB(
    req.params.id as string,
  );

  if (!issue) {
    return res.status(404).json({
      success: false,
      message: "Issue not found",
    });
  }

 

  const updated = await issueService.updateIssueIntoDB(
    req.params.id as string,
    req.body,
  );

  res.json({
    success: true,
    message: "Issue updated successfully",
    data: updated,
  });
};

const deleteIssue = async (req: Request, res: Response) => {
  await issueService.deleteIssueFromDB(req.params.id as string);

  res.json({
    success: true,
    message: "Issue deleted successfully",
  });
};

export const userController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
