import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1).max(255),
  stocks: z.number().int().min(0).optional().default(0),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal number"),
  sku: z.string().min(1).max(100),
});

export const createProductsSchema = z.object({
  body: z.object({
    type: z.enum(["single", "multiple"]),
    products: z.union([
      productSchema,
      z.array(productSchema).min(1),
    ]),
  }).refine(
    (data) => {
      if (data.type === "single") {
        return !Array.isArray(data.products);
      } else {
        return Array.isArray(data.products);
      }
    },
    {
      message: "Type 'single' requires products to be an object, type 'multiple' requires products to be an array",
    }
  ),
});

export type CreateProductsInput = z.infer<typeof createProductsSchema>["body"];

