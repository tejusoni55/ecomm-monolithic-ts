import { drizzle } from "drizzle-orm/node-postgres";
import { pgPool } from "../../config/database";
import * as schema from "./schema";
// import { seed, reset } from "drizzle-seed";

export const db = drizzle(pgPool, {
  schema,
  logger: process.env.NODE_ENV === "development",
});

// async function main() {
//   try {
//     await reset(db, { schema: schema.products });
//   } catch (error) {
//     console.error(error);
//     // process.exit(1);
//   }
// }

// main();
