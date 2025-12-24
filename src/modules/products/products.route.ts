import express from "express";
import productsController from "./products.controller";
import { validate } from "../../common/middlewares/validate";
import { getAllProductsSchema } from "./products.validators";

const router = express.Router();

/**
 * @openapi
 *  '/api/v1/products/':
 *  get:
 *      tags:
 *          - Products
 *      summary: Fetch product details
 *      parameters:
 *          - in:
 *            name: limit
 *            schema:
 *              type: number
 *              minimum: 1
 *              description: The number of product items to return
 *          - in:
 *            name: page
 *            schema:
 *              type: number
 *              minimum: 1
 *              description: The number of page, defaults to 1.
 *      responses:
 *          200:
 *              description: Returns list of products
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/ProductFetchResponse'
 *          400:
 *              description: Bad Request
 *          500:
 *              description: Internal Server Error
 * 
 *
 */
router.get("/", validate(getAllProductsSchema), productsController.getAllProducts);

export default router;

