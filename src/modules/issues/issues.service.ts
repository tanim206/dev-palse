import { pool } from "../../db";
import type { IIssue } from "./issues.interface";

const createIssueIntoDB = async (data: IIssue) => {
  const result = await pool.query(
    `
    INSERT INTO issues (title, description, type, status, reporter_id)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
    `,
    [
      data.title,
      data.description,
      data.type,
      data.status || "open",
      data.reporter_id,
    ]
  );

  return result.rows[0];
};

const getAllIssuesFromDB = async (query: any) => {
  const { sort = "newest", type, status } = query;

  let sql = `SELECT * FROM issues`;
  const values: any[] = [];
  const conditions: string[] = [];

  let i = 1;

  if (type) {
    conditions.push(`type = $${i++}`);
    values.push(type);
  }

  if (status) {
    conditions.push(`status = $${i++}`);
    values.push(status);
  }

  if (conditions.length) {
    sql += ` WHERE ` + conditions.join(" AND ");
  }

  sql +=
    sort === "oldest"
      ? ` ORDER BY created_at ASC`
      : ` ORDER BY created_at DESC`;

  const issuesRes = await pool.query(sql, values);
  const issues = issuesRes.rows;

  const ids = [
    ...new Set(issues.map((i) => i.reporter_id)),
  ];

  const usersRes = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1)`,
    [ids]
  );

  return issues.map((issue) => ({
    ...issue,
    reporter: usersRes.rows.find(
      (u) => u.id === issue.reporter_id
    ),
  }));
};

const getSingleIssueFromDB = async (id: string) => {
  const issueRes = await pool.query(
    `SELECT * FROM issues WHERE id=$1`,
    [id]
  );

  const issue = issueRes.rows[0];
  if (!issue) return null;

  const userRes = await pool.query(
    `SELECT id,name,role FROM users WHERE id=$1`,
    [issue.reporter_id]
  );

  return {
    ...issue,
    reporter: userRes.rows[0],
  };
};

const updateIssueIntoDB = async (
  id: string,
  payload: any
) => {
  const old = await getSingleIssueFromDB(id);

  const result = await pool.query(
    `
    UPDATE issues
    SET title=$1,
        description=$2,
        type=$3,
        status=$4,
        updated_at=CURRENT_TIMESTAMP
    WHERE id=$5
    RETURNING *
    `,
    [
      payload.title || old.title,
      payload.description || old.description,
      payload.type || old.type,
      payload.status || old.status,
      id,
    ]
  );

  return result.rows[0];
};

const deleteIssueFromDB = async (id: string) => {
  await pool.query(`DELETE FROM issues WHERE id=$1`, [
    id,
  ]);

  return true;
};

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueIntoDB,
  deleteIssueFromDB,
};