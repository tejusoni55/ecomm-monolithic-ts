import { Request, Response, NextFunction } from "express";
import auth from "./auth";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export default {
  requireAdmin: async function (req: Request, res: Response, next: NextFunction) {
    // First authenticate the user
    return auth.authenticate(req, res, async () => {
      // Get full user details including role
      const fullUser = await db.query.users.findFirst({
        where: eq(users.id, req.user.id),
        columns: {
          id: true,
          role: true,
        },
      });

      if (!fullUser || fullUser.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Admin access required",
        });
      }

      next();
    });
  },
};

