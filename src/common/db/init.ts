import { db } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { env } from "../../config/env";
import { pgPool } from "../../config/database";

async function initializeAdmin() {
  try {
    console.log("Checking for admin user...");

    // Check if admin user already exists
    const existingAdmin = await db.query.users.findFirst({
      where: eq(users.email, env.ADMIN_EMAIL),
    });

    if (existingAdmin) {
      console.log("Admin user already exists. Skipping creation.");
      return;
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash(env.ADMIN_PASSWORD, 10);

    // Create admin user
    const [admin] = await db
      .insert(users)
      .values({
        email: env.ADMIN_EMAIL,
        name: env.ADMIN_NAME,
        password: hashedPassword,
        role: "admin",
        isActive: true,
      })
      .returning();

    console.log("Admin user created successfully!");
    console.log(`Email: ${admin.email}`);
    console.log(`Name: ${admin.name}`);
    console.log(`Role: ${admin.role}`);
  } catch (error) {
    console.error("Error initializing admin user:", error);
    throw error;
  }
}

// Run initialization
initializeAdmin()
  .then(() => {
    console.log("Initialization completed.");
  })
  .catch((error) => {
    console.error("Initialization failed:", error);
    process.exit(1);
  })
  .finally(() => {
    pgPool.end();
  });

