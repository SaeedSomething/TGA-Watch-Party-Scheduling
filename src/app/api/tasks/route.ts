import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { TaskSubmission } from "@/types/tasks";

type SqlClient = ReturnType<typeof neon> | null;

const memoryTasks: TaskSubmission[] = [];
const getSqlClient = (() => {
  let client: SqlClient = null;
  let attempted = false;
  return (): SqlClient => {
    if (attempted) return client;
    attempted = true;
    const connectionString = process.env.NEON_DATABASE_URL;
    if (!connectionString) return null;
    try {
      client = neon(connectionString);
    } catch (err) {
      console.warn("Invalid NEON_DATABASE_URL provided, falling back to memory store", err);
      client = null;
    }
    return client;
  };
})();

type TaskRow = {
  id: string;
  name: string;
  item: string;
  note: string | null;
  created_at: string;
};

async function ensureTable() {
  const sql = getSqlClient();
  if (!sql) {
    return;
  }

  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      item TEXT NOT NULL,
      note TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `;
}

function formatRow(row: TaskRow): TaskSubmission {
  return {
    id: row.id,
    name: row.name,
    item: row.item,
    note: row.note ?? undefined,
    createdAt: row.created_at
  };
}

export async function GET() {
  const sql = getSqlClient();
  if (!sql) {
    return NextResponse.json(memoryTasks.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }

  await ensureTable();
  const rows = (await sql`
    SELECT id, name, item, note, created_at
    FROM tasks
    ORDER BY created_at DESC;
  `) as TaskRow[];

  const data = rows.map(formatRow);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<Omit<TaskSubmission, "id" | "createdAt">>;
  const name = payload.name?.trim();
  const item = payload.item?.trim();
  const note = payload.note?.trim();

  if (!name || !item) {
    return NextResponse.json({ message: "Please add a name and select an item." }, { status: 400 });
  }

  const submission: TaskSubmission = {
    id: crypto.randomUUID(),
    name,
    item,
    note,
    createdAt: new Date().toISOString()
  };

  const sql = getSqlClient();
  if (!sql) {
    memoryTasks.unshift(submission);
    return NextResponse.json(submission, { status: 201 });
  }

  await ensureTable();
  await sql`
    INSERT INTO tasks (id, name, item, note)
    VALUES (${submission.id}, ${submission.name}, ${submission.item}, ${submission.note ?? null});
  `;

  return NextResponse.json(submission, { status: 201 });
}
