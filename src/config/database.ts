import { Pool } from "pg";
import { env } from "./env";
console.log("env.DATABASE_URL =>", env.DATABASE_URL);

export const pgPool = new Pool({
  connectionString: env.DATABASE_URL!,
  // ssl: env.NODE_ENV === "production",
});

//  postgres://postgres:postgres@postgres:5432/ecomm-monolithic

export async function checkPgConnection() {
  try {
    const client = await pgPool.connect();
    await client.query("SELECT 1");
    client.release();
    console.log("PostgreSQL connected");
  } catch (err) {
    console.error("PostgreSQL connection failed", err);
    throw err;
  }
}