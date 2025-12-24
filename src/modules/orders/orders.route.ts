import express from "express";
import ordersController from "./orders.controller";
import auth from "../../common/middlewares/auth";
import { validate } from "../../common/middlewares/validate";
import { createOrderSchema } from "./orders.validators";

const router = express.Router();

/**
 * @openapi
 *  '/api/v1/orders':
 *  get:
 *      tags:
 *          - Orders
 *      summary: Fetch user orders
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Returns list of orders realted to user
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/OrderFetchResponse'
 *          400:
 *              description: Bad Request
 *          500:
 *              description: Interanl server error
 *                  
 */
router.get("/", auth.authenticate, ordersController.getAllOrders);

/**
 * @openapi
 *  '/api/v1/orders':
 *  post:
 *      tags:
 *          - Orders
 *      summary: Place new orders
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/PlaceOrderRequest'
 *      responses:
 *          200:
 *              description: Returns object contains data
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/PlaceOrderResponse'
 *          400:
 *              description: Bad Request
 *          500:
 *              description: Interanl server error
 *                  
 */
router.post("/", auth.authenticate, validate(createOrderSchema), ordersController.createOrder);

export default router;

