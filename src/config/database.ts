import { Pool } from "pg";
import { env } from "./env";

export const pgPool = new Pool({
  connectionString: env.DATABASE_URL!,
  ssl: env.NODE_ENV === "production",
});
