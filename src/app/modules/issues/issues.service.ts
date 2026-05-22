import { pool } from "../../../db/index.js";
import type { IIssue } from "./issues.interface.js";

const createIssueIntoDB = async (payload: IIssue) => {
  const { title, description, type, status, reporter_id } = payload;
  if (!type) {
    throw new Error("Invalid type");
  }

  const result = await pool.query(
    `
    INSERT INTO issues (title, description, type, status, reporter_id)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
    `,
    [title, description, type, status || "open", reporter_id],
  );

  return result.rows[0];
};

const getAllIssuesIntoDB = async (query: any) => {
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

  if (!issues.length) {
    return [];
  }

  const ids = [...new Set(issues.map((i) => i.reporter_id))];

  const usersRes = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1)`,
    [ids],
  );

  return issues.map((issue) => {
    const reporterObj =
      usersRes.rows.find((u) => u.id === issue.reporter_id) || null;
    const { id, title, description, type, status, created_at, updated_at } =
      issue as any;

    const createTime =
      created_at instanceof Date ? created_at.toISOString() : created_at;
    const updateTime =
      updated_at instanceof Date ? updated_at.toISOString() : updated_at;

    return {
      id,
      title,
      description,
      type,
      status,
      reporter: reporterObj,
      created_at: createTime,
      updated_at: updateTime,
    };
  });
};

const getSingleIssueIntoDB = async (id: string) => {
  const issueRes = await pool.query(`SELECT * FROM issues WHERE id=$1`, [id]);

  const issue = issueRes.rows[0];
  if (!issue) return null;

  const userRes = await pool.query(
    `SELECT id,name,role FROM users WHERE id=$1`,
    [issue.reporter_id],
  );

  const reporter = userRes.rows[0] || null;

  const {
    reporter_id,
    id: iid,
    title,
    description,
    type,
    status,
    created_at,
    updated_at,
  } = issue as any;

  const ca = created_at instanceof Date ? created_at.toISOString() : created_at;
  const ua = updated_at instanceof Date ? updated_at.toISOString() : updated_at;

  return {
    id: iid,
    title,
    description,
    type,
    status,
    reporter,
    created_at: ca,
    updated_at: ua,
  };
};

const updateIssueIntoDB = async (id: string, payload: any) => {
  await getSingleIssueIntoDB(id);

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
    [payload.title, payload.description, payload.type, payload.status, id],
  );

  const updated = result.rows[0] as any;

  const created_at =
    updated.created_at instanceof Date
      ? updated.created_at.toISOString()
      : updated.created_at;
  const updated_at =
    updated.updated_at instanceof Date
      ? updated.updated_at.toISOString()
      : updated.updated_at;

  return {
    ...updated,
    created_at,
    updated_at,
  };
};

const deleteIssueFromDB = async (id: string) => {
  await pool.query(`DELETE FROM issues WHERE id=$1`, [id]);

  return true;
};

export const issueService = {
  createIssueIntoDB,
  getAllIssuesIntoDB,
  getSingleIssueIntoDB,
  updateIssueIntoDB,
  deleteIssueFromDB,
};
