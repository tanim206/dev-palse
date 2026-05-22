import { Pool } from "pg";
import config from "../app/config";

export const pool = new Pool({
  connectionString: config.connect_string,
});

export const dataBase = async () => {
  try {
    // ১. ইউজার টেবিল তৈরি (অতিরিক্ত ব্র্যাকেট রিমুভ করা হয়েছে)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(20) DEFAULT 'contributor',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    //২. ইস্যু টেবিল তৈরি (কমা ফিক্স করা হয়েছে এবং অ্যাসাইনমেন্ট অনুযায়ী REFERENCES বাদ দেওয়া হয়েছে)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(20) DEFAULT 'bug',
        status VARCHAR(30) DEFAULT 'open',
        reporter_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("Database connected ");
  } catch (error) {
    console.error("Database initialization failed", error);
  }
};
