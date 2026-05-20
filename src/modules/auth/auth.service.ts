import { pool } from "../../db";
import type { IUer } from "./auth.interface";

const createUserIntoDB = async (payload: IUer) => {
  const { name, email, password, role } = payload;

  const result = await pool.query(
    `

     INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,COALESCE($4,'contributor')) RETURNING *

    `,
    [name, email, password, role],
  );
  return result;
};

export const authService = {
  createUserIntoDB,
};
