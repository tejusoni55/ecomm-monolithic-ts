import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    email: z.email().max(255),
    name: z.string().min(2).max(255),
    password: z.string().min(8).max(16),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8),
  }),
});

const findUserByColumnSchema = z.object({
  id: z.number().optional(),
  email: z.email().optional(),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>["body"];
export type LoginUserInput = z.infer<typeof loginSchema>["body"];
export type findByColumnInput = z.infer<typeof findUserByColumnSchema>;
