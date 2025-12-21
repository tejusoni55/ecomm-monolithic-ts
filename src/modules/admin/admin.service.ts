import { db } from "../../common/db";
import { users, products } from "../../common/db/schema";
import { eq } from "drizzle-orm";
import { CreateProductsInput } from "./admin.validators";
import { DrizzleQueryError } from "drizzle-orm/errors";
import { DatabaseError } from "pg";

export default {
  getAllUsers: async function () {
    const allUsers = await db.query.users.findMany({
      where: eq(users.role, "user"),
      columns: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      data: allUsers,
    };
  },

  createProducts: async function (data: CreateProductsInput) {
    // Extract products based on type
    const productsToInsert =
      data.type === "single"
        ? [data.products as { name: string; stocks?: number; price: string; sku: string }]
        : (data.products as Array<{ name: string; stocks?: number; price: string; sku: string }>);

    // Convert price from string to decimal format
    const formattedProducts = productsToInsert.map((product) => ({
      name: product.name,
      stocks: product.stocks ?? 0,
      price: product.price,
      sku: product.sku,
    }));

    try {
      const insertedProducts = await db.insert(products).values(formattedProducts).returning();

      return {
        success: true,
        message: `Successfully created ${insertedProducts.length} product(s)`,
        data: insertedProducts,
      };
    } catch (error: DrizzleQueryError | any) {
      // Handle unique constraint violation (duplicate SKU)
      if (error instanceof DrizzleQueryError) {
        if (error.cause instanceof DatabaseError) {
          if (error.cause.code === "23505" || error.cause.constraint?.includes("sku")) {
            return {
              success: false,
              message: "Product with this SKU already exists",
            };
          }
        }

        return {
          success: false,
          message: error.cause?.message ?? "Failed to create products",
        };
      }

      return {
        success: false,
        message: "Failed to create products",
        error: error.message,
      };
    }
  },
};
