import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { authRoute } from "./modules/auth/auth.route";

const app: Application = express();

app.use(express.json()); // middlewere json formet
app.use(express.text()); // middlewere text formet
app.use(express.urlencoded({ extended: true })); // middlewere urlencoded

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello World!!!",
  });
});

app.use("/api/auth", authRoute);

app.use(globalErrorHandler);

export default app;
