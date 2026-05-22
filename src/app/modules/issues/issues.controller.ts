import type { Request, Response } from "express";
import { issueService } from "./issues.service";

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

const getAllIssues = async (req: Request, res: Response) => {
  const data = await issueService.getAllIssuesFromDB(
    req.query
  );

  res.json({
    success: true,
    data,
  });
};

const getSingleIssue = async (req: Request, res: Response) => {
  const data = await issueService.getSingleIssueFromDB(
    req.params.id as string
  );

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
    req.params.id as string
  );

  if (!issue) {
    return res.status(404).json({
      success: false,
      message: "Issue not found",
    });
  }

  if (
    user.role === "contributor" &&
    (issue.reporter_id !== user.id ||
      issue.status !== "open")
  ) {
    return res.status(403).json({
      success: false,
      message:
        "You can only update your own open issues",
    });
  }

  const updated =
    await issueService.updateIssueIntoDB(
      req.params.id as string,
      req.body
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