import { z } from "zod";
import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV && process.env.NODE_ENV !== "development" ? `.env.${process.env.NODE_ENV}` : ".env",
});

const envSchema = z.object({
  PORT: z.string().default("8000"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.url().nullish(),
  JWT_SECRET: z.string().default("QVG2t8WAYPgk3suwVojIUDfFS9ZpFZrThifK5n8YHdHHNVA+0VG8zWTxAK3Eatgt"),
  JWT_EXPIRES: z.string().default("1d"),
  ADMIN_EMAIL: z.email().default("admin@example.com"),
  ADMIN_PASSWORD: z.string().min(8).default("admin123"),
  ADMIN_NAME: z.string().default("Admin User"),
  OTEL_SERVICE_NAME: z.string().default("ecomm-monolithic-service"),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.url().default("http://localhost:4318"),
});

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error("Unable to parse environment file validation");
  console.error(parsedEnv.error);
  process.exit(1);
}

export const env = parsedEnv.data;
