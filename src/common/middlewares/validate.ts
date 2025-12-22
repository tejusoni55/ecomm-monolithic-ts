import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

export const validate = (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    logger.error("Validation failed", { errors: result.error });
    return res.status(400).json({
      message: "Validation failed",
      errors: JSON.parse(result?.error?.message),
    });
  }

  // replace with validated data
  // ✅ body is safe to reassign
  if (result.data.body) {
    req.body = result.data.body;
  }

  // ✅ params & query: mutate, don't replace
  if (result.data.params) {
    Object.assign(req.params, result.data.params);
  }

  if (result.data.query) {
    Object.assign(req.query, result.data.query);
  }

  next();
};
