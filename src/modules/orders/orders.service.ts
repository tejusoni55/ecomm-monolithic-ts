import { db } from "../../common/db";
import { orders, products } from "../../common/db/schema";
import { eq } from "drizzle-orm";
import { CreateOrderInput } from "./orders.validators";

export default {
  getAllOrdersByUserId: async function (userId: number) {
    const userOrders = await db.query.orders.findMany({
      where: eq(orders.userId, userId),
    });

    return {
      success: true,
      data: userOrders,
    };
  },

  createOrder: async function (userId: number, data: CreateOrderInput) {
    // Check if product exists
    const product = await db.query.products.findFirst({
      where: eq(products.id, data.productId),
    });

    if (!product) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    // Check stock availability
    if (product.stocks < data.quantity) {
      return {
        success: false,
        message: `Insufficient stock. Available: ${product.stocks}, Requested: ${data.quantity}`,
      };
    }

    try {
      // Create order
      const [newOrder] = await db
        .insert(orders)
        .values({
          productId: data.productId,
          userId: userId,
          quantity: data.quantity,
        })
        .returning();

      // Update product stock
      await db
        .update(products)
        .set({
          stocks: product.stocks - data.quantity,
        })
        .where(eq(products.id, data.productId));

      return {
        success: true,
        message: "Order created successfully",
        data: newOrder,
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to create order",
        error: error.message,
      };
    }
  },
};

