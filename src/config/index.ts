import dotenv from "dotenv";
import { env } from "node:process";

dotenv.config({ quiet: true });

const config = {
  port: env.PORT,
  connect_string: env.CONNECTIONSTRING,
};

export default config;
