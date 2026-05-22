import express from "express";
import { auth, roleCheck } from "../../middleware/auth.js";
import { userController } from "./issues.controller.js";

const router = express.Router();

router.post("/", auth, userController.createIssue);
router.get("/", userController.getAllIssues);
router.get("/:id", userController.getSingleIssue);
router.patch("/:id", auth, userController.updateIssue);
router.delete(
  "/:id",
  auth,
  roleCheck("maintainer"),
  userController.deleteIssue,
);

export const issueRoute = router;
