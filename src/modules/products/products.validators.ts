import { z } from "zod";

export const getAllProductsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
  }),
});

export type GetAllProductsQuery = z.infer<typeof getAllProductsSchema>["query"];

