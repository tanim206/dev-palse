import http from "http";
import app from "./app.js";
import config from "./app/config/index.js";
import { dataBase } from "./db/index.js";
const server = http.createServer(app);
const main = async () => {
  try {
    await dataBase();
    server.listen(config.port, () => {
      console.log(`Server is running at ${config.port}`);
    });
  } catch (error) {
    console.error(
      "Failed to start the server due to a DB connection error",
      error,
    );
    process.exit(1);
  }
};

main();
