import { db } from "../../common/db";
import { users } from "../../common/db/schema";
import { eq } from "drizzle-orm";
import { RegisterUserInput, LoginUserInput, findByColumnInput } from "./users.validators";
import bcrypt from "bcrypt";
import jwtUtil from "../../common/utils/jwt";

export default {
  findUserByColumn: async function (data: findByColumnInput, columns: string[] = []) {
    if (!data.email && !data.id) {
      return {
        success: false,
        message: "Invalid params: Either id or email required to fetch record",
      };
    }

    let where = data.email ? eq(users.email, data.email) : eq(users.id, data.id ?? 0);
    let user = await db.query.users.findFirst({
      columns: {
        id: true,
        name: true,
        email: true,
      },
      where,
    });

    return {
      success: true,
      data: user,
    };
  },

  registerUser: async function (data: RegisterUserInput) {
    // check if same email record exist or not
    let record = await this.findUserByColumn({ email: data.email });

    if (record.success && record.data) {
      // Email already exist
      return {
        success: false,
        message: "Email already exist. Try using different",
      };
    }

    // Hash the password
    data.password = await bcrypt.hash(data.password, 10);

    // Create a new record
    let [user] = await db.insert(users).values(data).returning();

    return {
      success: true,
      data: user,
    };
  },

  loginUser: async function (data: LoginUserInput) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (user) {
      // Check for password
      if (await bcrypt.compare(data.password, user.password)) {
        // Generate a new token
        let token = jwtUtil.jwtSign({ id: user.id });

        return {
          success: true,
          message: "Logged in successfully",
          token,
        };
      }
      return {
        success: false,
        message: "Invalid credentials: Wrong password",
      };
    }

    return {
      success: false,
      message: "No account exist with this email",
    };
  },
};
