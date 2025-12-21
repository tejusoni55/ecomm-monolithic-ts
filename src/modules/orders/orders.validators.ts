import { z } from "zod";

export const getAllOrdersSchema = z.object({
  query: z.object({}).optional(),
});

export const createOrderSchema = z.object({
  body: z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive().min(1),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>["body"];
