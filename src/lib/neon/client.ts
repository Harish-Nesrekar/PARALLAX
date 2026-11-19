import "server-only";
import { neon } from "@neondatabase/serverless";

let sqlClient: ReturnType<typeof neon> | undefined;

/** Lazily create a Neon HTTP SQL client for server-side route handlers. */
export function getNeonSql() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured. Run neon deploy and check .env.local.");
  }
  sqlClient ??= neon(connectionString);
  return sqlClient;
}
