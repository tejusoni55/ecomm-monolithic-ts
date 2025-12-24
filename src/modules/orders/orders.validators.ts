import { z } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    OrderFetchResponse:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        userId:
 *          type: number
 *        productId:
 *          type: number
 *        quantity:
 *          type: number
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 *        
 */
export const getAllOrdersSchema = z.object({
  query: z.object({}).optional(),
});

/**
 * @openapi
 * components:
 *  schemas:
 *    PlaceOrderRequest:
 *      type: object
 *      properties:
 *        productId:
 *          type: number
 *        quantity:
 *          type: number
 *    PlaceOrderResponse:
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *        message:
 *          type: string
 *        data:
 *          type: object
 */
export const createOrderSchema = z.object({
  body: z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive().min(1),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>["body"];
