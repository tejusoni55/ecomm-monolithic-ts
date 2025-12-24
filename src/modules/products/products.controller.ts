import { Request, Response } from "express";
import productsService from "./products.service";

export default {
  /**
   * @openapi
   * components:
   *  schemas:
   *    ProductFetchResponse:
   *      type: object
   *      properties:
   *        id:
   *          type: string
   *        name:
   *          type: string
   *        price:
   *          type: number
   *        stock:
   *          type: number
   *        sku:
   *          type: string
   *        createdAt:
   *          type: string
   *        updatedAt:
   *          type: string
   */
  getAllProducts: async function (req: Request, res: Response) {
    const result = await productsService.getAllProducts(req.query);
    res.json(result);
  },
};
