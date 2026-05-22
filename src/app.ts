import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { authRoute } from "./app/modules/auth/auth.route.js";
import { issueRoute } from "./app/modules/issues/issues.route.js";
import globalErrorHandler from "./app/middleware/globalErrorHandler.js";

const app: Application = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello Dev Pulse!",
  });
});

app.use("/api/auth", authRoute);
app.use("/api/issues", issueRoute);

app.use(globalErrorHandler);

export default app;
