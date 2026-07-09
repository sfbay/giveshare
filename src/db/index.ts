import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Placeholder keeps `next build` from throwing at import time; every page that
// queries is force-dynamic, so real requests always have the env var.
const sql = neon(
  process.env.DATABASE_URL ?? "postgresql://build:build@localhost:5432/build",
);
export const db = drizzle(sql, { schema });
