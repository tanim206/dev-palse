import { Pool } from "pg";
import config from "../config";
export const pool = new Pool({
  connectionString: config.connect_string,
});

export const dataBase = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(40) NOT NULL,
            email VARCHAR(50) UNIQUE NOT NULL,
            password TEXT NOT NULL,

            role VARCHAR(20) DEFAULT 'contributor',

            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()

            )`);

    console.log("Database connect successfuully");
  } catch (error) {
    console.log(error);
  }
};
