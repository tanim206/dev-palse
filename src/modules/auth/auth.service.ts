import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import config from "../../config";
import type { IUser } from "./auth.interface";
import { pool } from "../../db";

const createUser = async (payload: IUser) => {
  const hashed = await bcrypt.hash(payload.password, 10);
  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at, updated_at
    `,
    [payload.name, payload.email, hashed, payload.role],
  );

  return result.rows[0];
};

const loginUser = async (email: string, password: string) => {
  const userResult = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  const user = userResult.rows[0];

  if (!user) throw new Error("User not found");

  const match = await bcrypt.compare(password, user.password);

  if (!match) throw new Error("Invalid password");

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email:user.email,
      role: user.role,
    },
    config.secretKey as string,
    { expiresIn: "1d" },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const authService = {
  createUser,
  loginUser,
};
