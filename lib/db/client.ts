import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Falls back to a placeholder connection string so importing this module (and
// building the Auth.js Drizzle adapter, which needs a real PgDatabase instance)
// doesn't crash before a real database is provisioned. Actual queries will fail
// until DATABASE_URL points at a real Postgres instance (e.g. Neon via Vercel).
const connectionString = process.env.DATABASE_URL ?? "postgres://user:pass@localhost:5432/placeholder";

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });
